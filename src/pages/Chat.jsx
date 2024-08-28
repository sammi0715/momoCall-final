import { useEffect, useReducer } from "react";
import { FiChevronLeft, FiAlertTriangle, FiImage, FiSend } from "react-icons/fi";
import happy from "./img/happy.png";
import responses from "./responses.json";
import { db, storage, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc, getDocs, where } from "../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";
import tappay from "../utils/tappay";

const initialState = {
  messages: [],
  inputValue: "",
  showOrderInfo: false,
  showShopInfo: false,
  showProductInfo: false,
  isChoose: false,
  isPerchase: false,
  isCheckout: false,
  count: 0,
  divHeightClass: "h-screen",
  productInfo: null,
  shopName: "",
  orderInfo: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "SET_INPUT_VALUE":
      return { ...state, inputValue: action.payload };
    case "TOGGLE_ORDER_INFO":
      return { ...state, showOrderInfo: action.payload };
    case "TOGGLE_SHOP_INFO":
      return { ...state, showShopInfo: action.payload };
    case "TOGGLE_PRODUCT_INFO":
      return { ...state, showProductInfo: action.payload };
    case "RESET_INPUT_VALUE":
      return { ...state, inputValue: "" };
    case "TO_PURCHASE":
      return { ...state, isChoose: !state.isChoose };
    case "TO_CHECKOUT":
      if (state.count === 0) {
        alert("請選擇數量");
        return state;
      }
      return { ...state, isPerchase: !state.isPerchase };
    case "FINISH_CHECKOUT":
      if (state.isCheckout == true) {
        window.location.reload();
      }
      return {
        ...state,
        isCheckout: !state.isCheckout,
        isChoose: false,
        isPerchase: false,
        count: 0,
      };
    case "ADD_PRODUCT_NUM":
      return { ...state, count: state.count + 1 };
    case "SUB_PRODUCT_NUM":
      if (state.count === 0) {
        return state;
      }
      return { ...state, count: state.count - 1 };

    case "SET_DIV_HEIGHT":
      return {
        ...state,
        divHeightClass: action.payload,
      };
    case "SET_PRODUCT_INFO":
      return { ...state, productInfo: action.payload };
    case "SET_SHOP_NAME":
      return { ...state, shopName: action.payload };
    case "SET_ORDER_INFO":
      return { ...state, orderInfo: action.payload };
    default:
      return state;
  }
}
function Finish() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const fetchOrderInfo = async (shopId, orderNumber) => {
    try {
      const ordersCollectionRef = collection(db, "orders");
      const orderQuery = query(ordersCollectionRef, where("shopId", "==", shopId), where("orderNumber", "==", orderNumber));
      const querySnapshot = await getDocs(orderQuery);
      if (!querySnapshot.empty) {
        const orderDoc = querySnapshot.docs[0];
        dispatch({ type: "SET_ORDER_INFO", payload: orderDoc.data() });
      } else {
        console.log("No matching order found!");
      }
    } catch (error) {
      console.error("Error getting order documents:", error);
    }
  };

  const fetchProductInfo = async (shopId, productNumber) => {
    try {
      const shopQuery = query(collection(db, "shops"), where("shopId", "==", shopId));
      const shopSnapshot = await getDocs(shopQuery);
      if (!shopSnapshot.empty) {
        const shopDoc = shopSnapshot.docs[0];
        const shopDocId = shopDoc.id;
        const shopName = shopDoc.data().shopName;

        dispatch({ type: "SET_SHOP_NAME", payload: shopName });

        if (productNumber) {
          const productsCollectionRef = collection(doc(db, "shops", shopDocId), "products");
          const productQuery = query(productsCollectionRef, where("productNumber", "==", productNumber));
          const productSnapshot = await getDocs(productQuery);
          if (!productSnapshot.empty) {
            const productDoc = productSnapshot.docs[0];
            dispatch({ type: "SET_PRODUCT_INFO", payload: productDoc.data() });
          } else {
            console.log("No matching product found!");
            dispatch({ type: "SET_PRODUCT_INFO", payload: null });
          }
        } else {
          dispatch({ type: "SET_PRODUCT_INFO", payload: null });
        }

        dispatch({ type: "TOGGLE_SHOP_INFO", payload: true });
      } else {
        console.log("No matching shop found for the given shopId!");
        dispatch({ type: "SET_SHOP_NAME", payload: "商家名稱未找到" });
        dispatch({ type: "TOGGLE_SHOP_INFO", payload: true });
      }
    } catch (error) {
      console.error("Error getting product documents:", error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 500);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const shopId = queryParams.get("member");
    const orderNumber = queryParams.get("order");
    const productNumber = queryParams.get("product");

    if (shopId) {
      dispatch({ type: "TOGGLE_SHOP_INFO", payload: true });
      fetchProductInfo(shopId, productNumber);
      if (orderNumber) {
        dispatch({ type: "TOGGLE_ORDER_INFO", payload: true });
        fetchOrderInfo(shopId, orderNumber);
      } else if (productNumber) {
        dispatch({ type: "TOGGLE_SHOP_INFO", payload: true });
        dispatch({ type: "TOGGLE_PRODUCT_INFO", payload: true });
        fetchProductInfo(shopId, productNumber);
      } else if (!orderNumber && !productNumber) {
        dispatch({ type: "TOGGLE_PRODUCT_INFO", payload: false });
        dispatch({ type: "TOGGLE_SHOP_INFO", payload: true });
      }
    } else {
      dispatch({ type: "TOGGLE_ORDER_INFO", payload: false });
      dispatch({ type: "TOGGLE_PRODUCT_INFO", payload: false });
    }

    // Firebase 查詢消息
    const chatroomName = shopId || " ";
    const q = query(collection(db, "chatroom", chatroomName, "messages"), orderBy("created_time"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      dispatch({ type: "SET_MESSAGES", payload: msgs });
    });

    const handleScroll = () => {
      const height = document.documentElement.scrollHeight;
      dispatch({
        type: "SET_DIV_HEIGHT",
        payload: height < 850 ? "h-screen" : "h-auto",
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const setupTappay = async () => {
      await tappay.setupSDK();
      tappay.setupCard();
    };
    setupTappay();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const predefinedResponses = responses.map((item) => ({
    pattern: new RegExp(item.pattern, "i"),
    response: item.response,
  }));

  const sendMessage = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const shopId = queryParams.get("member") || "chat1"; // 默认为 chat1
    const messagesCollectionRef = collection(db, "chatroom", shopId, "messages");

    if (state.inputValue.trim() !== "") {
      await addDoc(messagesCollectionRef, {
        content: state.inputValue,
        created_time: serverTimestamp(),
        from: "user1",
      });
      let response = "抱歉，我不太明白您的問題！";
      const matchedResponse = predefinedResponses.find(({ pattern }) => pattern.test(state.inputValue));

      if (matchedResponse) {
        response = matchedResponse.response;
      }

      await addDoc(messagesCollectionRef, {
        content: response,
        created_time: serverTimestamp(),
        from: "shop",
      });
      dispatch({ type: "RESET_INPUT_VALUE" }); // 清空輸入框
      scrollToBottom();
    }
  };

  const imageFormats = [".jpeg", ".jpg", ".png", ".gif"];
  const setChats = async (url) => {
    try {
      const messagesRef = collection(db, "chatroom", "chat1", "messages");
      const messageRef = doc(messagesRef);
      setDoc(messageRef, {
        content: url,
        created_time: serverTimestamp(),
        from: "user1",
      })
        .then(() => console.log("Document successfully written!"))
        .catch((error) => console.error("Error writing document: ", error));
    } catch (error) {
      console.error("Error getting random document:", error);
    }
  };
  const sendImage = (event) => {
    console.log(event.target.files);

    const file = event.target.files[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!file) return;
    if (!allowedTypes.includes(file.type)) {
      alert("請選擇一個有效的圖片文件（JPEG, PNG, GIF）。");
      event.target.value = "";
      return;
    }
    const storageRef = ref(storage, `images/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error("Upload failed:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setChats(downloadURL);
          // scrollToBottom();
        });
      }
    );
  };

  async function checkout() {
    try {
      if (!tappay.canGetPrime()) {
        window.alert("付款資料輸入有誤");
        return;
      }

      const result = await tappay.getPrime();
      if (result.status !== 0) {
        window.alert("付款資料輸入有誤");
        return;
      }

      dispatch({ type: "FINISH_CHECKOUT" });
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="bg-black-200 w-container my-0 mx-auto relative font-sans">
      <div className="bg-black-200 w-container px-3 fixed top-0 left-0 right-0 z-10 my-0 mx-auto">
        <div className="flex items-center py-4">
          <Link to={"/"}>
            <FiChevronLeft className="w-6 h-6 mr-3 cursor-pointer" />
          </Link>
          <h1 className="font-sans font-bold text-2xl leading-normal text-primary ml-20">對話紀錄</h1>
        </div>
      </div>

      {/* 這裡要做選擇，hidden or grid */}
      <div className={`${state.showOrderInfo ? "grid" : "hidden"}  bg-black-0 w-container py-2 px-3  grid-cols-4 gap-6  top-[68px] mt-[68px] left-0 right-0 z-10 my-0 mx-auto`}>
        <div className="flex flex-col items-center gap-y-2 col-span-1">
          <img
            src="https://images.unsplash.com/photo-1635865933730-e5817b5680cd?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="product-image"
            className="rounded-full w-large h-large"
          />
          <p className="text-xs leading-normal text-center w-large bg-secondary-400 text-secondary rounded-lg">{state.orderInfo?.status}</p>
        </div>
        <div className="flex flex-col gap-y-1 col-span-3">
          <p className="font-bold">{state.orderInfo?.shopName || "商家名稱未找到"}</p>
          <p className="text-primary">NT. {state.orderInfo?.totalPrice}</p>
          <p>訂單編號：{state.orderInfo?.orderNumber}</p>
        </div>
      </div>

      {/* 這裡要做選擇，hidden or flex */}
      <div className={`w-full product bg-white ${state.showShopInfo ? "flex" : "hidden"} justify-center gap-6 py-2 mt-[68px] items-center`}>
        <img src={happy} alt="camera" className="w-20 rounded-full" />
        <div className="w4/6 my-2 flex flex-col py-2 justify-between">
          <h4 className="w-fit text-base font-bold leading-normal line-clamp-1">{state.shopName || "商家名稱未找到"}</h4>
          <p className="text-base leading-normal text-secondary">momoCall 回應率：100%</p>
        </div>
      </div>

      <div className={`px-3 py-4 space-y-4 ${state.divHeightClass} ${!state.showOrderInfo && !state.showProductInfo ? "mt-[68px]" : ""} mb-[56px]`}>
        <div className="bg-accent flex justify-center items-center h-8 px-6 rounded-large">
          <FiAlertTriangle className="w-notice h-notice mr-4" />
          <p className="text-sm leading-normal">提醒您，請勿透露個人資料</p>
        </div>
        <div className="flex justify-center">
          <div className="bg-black-0 rounded-large w-14">
            <p className="text-xs leading-normal px-4">今天</p>
          </div>
        </div>
        <div>
          <div className={`bg-black-0 p-4 rounded-t-lg ${state.showProductInfo ? "flex" : "hidden"} justify-between border-b-1 border-black-400`}>
            <img src={state.productInfo?.image} alt="product-image" className="w-middle h-middle rounded-lg mr-3" />
            <div className="flex flex-col grow justify-between">
              <p className="text-xs leading-normal">商品編號 {state.productInfo?.productNumber}</p>
              <p className="w-full h-[36px] text-xs leading-normal font-bold line-clamp-2">{state.productInfo?.productName || "商品名稱未找到"}</p>
            </div>
          </div>
          <div className={`bg-black-0 rounded-b-lg  ${state.showProductInfo ? "flex" : "hidden"} justify-center`}>
            <button className="w-full py-2 text-xs leading-normal font-bold text-primary cursor-pointer" onClick={() => dispatch({ type: "TO_PURCHASE" })}>
              立即購買
            </button>
          </div>
        </div>
        {state.messages.map((message, index) => (
          <div key={index} className={`flex gap-1 mr-3 ${message.from === "user1" ? "justify-end" : ""}`}>
            {message.from !== "user1" && <img src={happy} alt="" className="w-9 h-9" />}
            <div
              className={`w-fit max-w-[65%]  text-black break-words rounded-lg p-3 relative ${message.from === "user1" ? "bg-white" : "bg-primary-600"} ${
                message.from === "user1" ? "order-2" : "order-1 ml-2"
              } ${
                message.from === "user1"
                  ? "after:absolute after:top-4 after:-right-3  after:content-[''] after:w-0 after:h-0 after:block  after:border-b-[20px] after:border-l-[20px] after:border-l-white after:border-b-transparent"
                  : "after:absolute after:top-4 after:-left-3  after:content-[''] after:w-0 after:h-0 after:block  after:border-b-[20px] after:border-r-[20px] after:border-r-primary-600 after:border-b-transparent"
              }`}
            >
              {imageFormats.some((format) => message.content.includes(format)) ? <img src={message.content} alt="Sent" className="rounded-lg max-w-full h-auto" /> : <p>{message.content}</p>}
            </div>
            <small className={`self-end ${message.from === "user1" ? "order-1 mr-3" : "order-2 ml-2"}`}>{message.created_time?.toDate().toLocaleTimeString() || "Loading..."}</small>
          </div>
        ))}
      </div>

      <div className={`${state.isChoose ? "flex" : "hidden"} justify-center items-center bg-black-800/80 w-container h-full  fixed top-0`}>
        <div className="w-64 h-60 bg-white mx-auto py-2 px-4 flex flex-col gap-3 text-sm rounded-xl">
          <h4 className="text-center font-bold leading-normal text-base text-primary-800">請選擇規格數量</h4>
          <div className="bg-black-0 p-1 rounded-t-large flex justify-center items-center">
            <img
              src="https://images.unsplash.com/photo-1721020693392-e447ac5f52ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="product-image"
              className="w-small h-small rounded-lg mr-3"
            />
            <div className="flex flex-col justify-between">
              <p className="text-xs leading-normal">123456</p>
              <p className="text-xs leading-normal font-bold line-clamp-1">商品名稱商品名稱商品名稱商品名稱商品名稱商品名稱最多兩行共四十個字多的用刪節號喔vsss</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-around items-center">
              <label htmlFor="spec">規格</label>
              <select name="spec" id="spec" className="w-2/4 border-1 border-black-600 rounded-md text-center">
                <option value="yellow">黃色</option>
              </select>
            </div>
            <div className="flex justify-around items-center ">
              <label htmlFor="number">數量</label>
              <div className="flex justify-around w-2/4 border-1 border-black-600 rounded-md">
                <button onClick={() => dispatch({ type: "SUB_PRODUCT_NUM" })}>-</button>
                <p className="leading-normal">{state.count}</p>
                <button onClick={() => dispatch({ type: "ADD_PRODUCT_NUM" })}>+</button>
              </div>
            </div>
            <div className="flex justify-around items-center">
              <p>總金額：</p>
              <p className="text-black-600 w-2/4 text-center">{state.count * 200}</p>
            </div>
          </div>
          <div className="flex justify-around items-center">
            <button className="block w-full h-8" onClick={() => dispatch({ type: "TO_PURCHASE" })}>
              取消
            </button>
            <button onClick={() => dispatch({ type: "TO_CHECKOUT" })} className="text-primary-800 font-bold block w-full h-8">
              下一步
            </button>
          </div>
        </div>
      </div>

      <div className={`${state.isPerchase ? "flex" : "hidden"} justify-center items-center  w-container h-full  fixed top-0`}>
        <div className="w-64 h-84 bg-white mx-auto py-2 px-4 flex flex-col gap-4 text-sm rounded-xl">
          <h4 className="text-center font-bold leading-normal text-lg text-primary-800 mt-2">訂單即將送出</h4>
          <p className="text-center font-bold">已確認品項、數量並進行結帳嗎？</p>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <p>產品名稱：</p>
              <p className="text-black-600 line-clamp-1 w-3/5">商品名稱商品名稱商品名稱商品名稱商品名稱商品名稱最多兩行共四十個字多的用刪節號喔vsss</p>
            </div>
            <div className="flex justify-between items-center">
              <p>數量：</p>
              <p className="text-black-600">{state.count}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>訂單金額：</p>
              <p className="text-black-600">{state.count * 200}</p>
            </div>
          </div>

          <h4 className="text-center font-bold leading-normal text-base text-primary-800">請輸入付款資訊</h4>
          <div className="flex flex-col gap-5">
            <div className="h-6 border-b-1 border-black-600 " id="card-number"></div>
            <div className="flex gap-4">
              <div className=" h-6 border-b-1 border-black-600 " id="card-expiration-date"></div>
              <div className="h-6 border-b-1 border-black-600 " id="card-ccv"></div>
            </div>
          </div>

          <div className="flex justify-around items-center ">
            <button className="block w-full h-9 text-black-600" onClick={() => dispatch({ type: "TO_CHECKOUT" })}>
              上一步
            </button>
            <button onClick={checkout} className="block w-full h-9 text-primary-800 font-bold ">
              確認
            </button>
          </div>
        </div>
      </div>

      <div className={`${state.isCheckout ? "flex" : "hidden"} justify-center items-center  w-container h-full  fixed top-0 bg-black-800/80`}>
        <div className="w-64 h-32 bg-white mx-auto py-2 px-4 flex flex-col gap-3 text-sm rounded-xl">
          <h4 className="text-center font-bold leading-normal text-lg text-primary-800 mt-2">付款成功，即將為您出貨</h4>
          <p className="text-center font-bold">訂單編號：20240827000001</p>

          <button onClick={() => dispatch({ type: "FINISH_CHECKOUT" })} className="block w-full h-8 text-primary-800 font-bold ">
            確認
          </button>
        </div>
      </div>

      <div className="bg-primary-600 w-container py-3 px-3 flex justify-between gap-x-2 fixed bottom-0 left-0 right-0 z-10 my-0 mx-auto">
        <label className="bg-black-0 rounded-full p-1 cursor-pointer active:outline active:outline-primary active:outline-1 active:outline-offset-0">
          <FiImage className="w-6 h-6 text-primary hover:text-primary-800 active:text-primary" />
          <input type="file" className="hidden" accept="image/jpg,image/jpeg,image/png,image/gif" onChange={sendImage} />
        </label>
        <input
          type="text"
          className="w-[271px] bg-black-200 grow rounded-3xl pl-3 border-0 focus:outline-primary focus:outline focus:outline-1 focus:outline-offset-0 focus:bg-white hover:bg-white"
          placeholder="輸入訊息"
          value={state.inputValue}
          onChange={(e) => dispatch({ type: "SET_INPUT_VALUE", payload: e.target.value })}
        />
        <button className="bg-white w-8 h-8 rounded-full active:border-primary active:border" onClick={sendMessage}>
          <FiSend className="w-5 h-5 mx-auto text-primary hover:text-primary" />
        </button>
      </div>
    </div>
  );
}

export default Finish;
