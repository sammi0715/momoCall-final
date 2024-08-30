import { useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiAlertTriangle, FiImage, FiSend } from "react-icons/fi";
import { AiOutlineLike, AiOutlineDislike, AiFillDislike, AiFillLike } from "react-icons/ai";
import happy from "./img/happy.png";
import responses from "./responses.json";
import loading from "./img/loading.gif";
import beenEater from "./img/beenEater.gif";
import { db, storage, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDocs, where } from "../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import useGoogleVisionAPI from "../utils/useGoogleVisionAPI";
import tappay from "../utils/tappay";
import { marked } from "marked";
import { format, isToday, isYesterday, differenceInMinutes } from "date-fns";
import { zhTW } from "date-fns/locale";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const initialState = {
  messages: [],
  inputValue: "",
  showOrderInfo: false,
  showShopInfo: false,
  showProductInfo: false,
  isGPTLoading: false,
  isImageLoading: false,
  isChoose: false,
  isPerchase: false,
  isCheckout: false,
  count: 0,
  spec: "",
  divHeightClass: "h-screen",
  productInfo: null,
  shopName: "",
  orderInfo: null,
  errorMsg: "",
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
    case "TOGGLE_USEFUL": {
      let copyMessages = state.messages.map((item, index) => {
        if (index == action.payload.index) return { ...item, isUseful: action.payload.isUseful };
        return item;
      });
      return { ...state, messages: copyMessages };
    }
    case "RESET_INPUT_VALUE":
      return { ...state, inputValue: "" };
    case "TOGGLE_GPT_LOADING":
      return { ...state, isGPTLoading: !state.isGPTLoading };
    case "TOGGLE_IMG_LOADING":
      return { ...state, isImageLoading: !state.isImageLoading };
    case "TO_PURCHASE":
      return { ...state, isChoose: !state.isChoose };
    case "TO_CHECKOUT":
      if (state.count === 0) {
        alert("請選擇數量");
        return state;
      }
      return { ...state, isPerchase: !state.isPerchase };
    case "FINISH_CHECKOUT":
      if (state.isCheckout == true) window.location.reload();
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
      if (state.count === 0) return state;
      return { ...state, count: state.count - 1 };
    case "SELECT_SPEC":
      return { ...state, spec: action.payload };
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
    case "SET_GPT_ERROR":
      return { ...state, errorMsg: action.payload };
    default:
      return state;
  }
}
function Finish() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentLabel, setCurrentLabel] = useState(""); // 用來顯示當前日期標籤
  const [isScrolling, setIsScrolling] = useState(false); //
  const { labels, handleAnalyzeImage } = useGoogleVisionAPI();

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
        const productsCollectionRef = collection(doc(db, "shops", shopDocId), "products");
        if (productNumber) {
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
          const productSnapshot = await getDocs(productsCollectionRef);
          const productList = productSnapshot.docs.map((doc) => doc.data());
          const randomIndex = Math.floor(Math.random() * productList.length);
          const productDoc = productSnapshot.docs[randomIndex];
          dispatch({ type: "SET_PRODUCT_INFO", payload: productDoc.data() });
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
  const queryParams = new URLSearchParams(window.location.search);
  const shopId = queryParams.get("member");
  const orderNumber = queryParams.get("order");
  const productNumber = queryParams.get("product");

  useEffect(() => {
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
        dispatch({ type: "TOGGLE_PRODUCT_INFO", payload: true });
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
    };
  }, []);
  let scrollTimeout;
  useEffect(() => {
    if (state.messages.length > 0) {
      const handleScroll = () => {
        setIsScrolling(true);
        clearTimeout(scrollTimeout);

        const scrollPosition = window.scrollY + 10;
        let newLabel = "";

        for (let i = 0; i < state.messages.length; i++) {
          const message = state.messages[i];
          const messageDate = message.created_time ? message.created_time.toDate() : null;

          let dateLabel = "Loading...";
          if (messageDate) {
            const now = new Date();
            const minutesDifference = differenceInMinutes(now, messageDate);

            if (minutesDifference < 30) {
              dateLabel = "剛剛";
            } else if (isToday(messageDate)) {
              dateLabel = "今天";
            } else if (isYesterday(messageDate)) {
              dateLabel = "昨天";
            } else {
              dateLabel = format(messageDate, "M/d (EEE)", { locale: zhTW });
            }
          }

          const element = document.getElementById(`message-${i}`);
          if (element && element.offsetTop >= scrollPosition) {
            newLabel = dateLabel;
            break;
          }
        }

        setCurrentLabel(newLabel);

        scrollTimeout = setTimeout(() => {
          setIsScrolling(false);
        }, 900);
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [state.messages]);

  useEffect(() => {
    if (state.messages.length > 0) {
      const firstMessage = state.messages[0];

      const messageDate = firstMessage.created_time ? firstMessage.created_time.toDate() : null;
      if (messageDate) {
        let label = "";
        const now = new Date();
        const minutesDifference = differenceInMinutes(now, messageDate);
        if (minutesDifference < 30) {
          label = "剛剛";
        } else if (isToday(messageDate)) {
          label = "今天";
        } else if (isYesterday(messageDate)) {
          label = "昨天";
        } else {
          label = format(messageDate, "M/d (EEE)", { locale: zhTW });
        }

        setCurrentLabel(label);
      }
    }
  }, [state.messages]);

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

  const fetchCustomGPTResponse = async (inputText, document) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    try {
      //complete fetch
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: 150,
          messages: [
            {
              role: "system",
              content: "你是一個全程使用繁體中文並且非常人性化回覆「已登入」的使用者提問MOMO電商客服相關問題，且不會提到「關鍵字」三個字的富邦媒體電商客服人員",
            },
            {
              role: "user",
              content: inputText,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        await addDoc(document, {
          content: data.choices[0].message.content,
          created_time: serverTimestamp(),
          from: "shop",
          isUsefull: "",
        });
      } else if (res.status === 429) {
        console.error("Too many requests. Please try again later.");
        dispatch({ type: "SET_GPT_ERROR", payload: "Too many requests. Please try again later." });
      } else {
        console.log(res.json());
        console.error("Error:", res.status, res.statusText);
        dispatch({ type: "SET_GPT_ERROR", payload: "An error occurred. Please try again later." });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      dispatch({ type: "SET_GPT_ERROR", payload: "An error occurred. Please try again later." });
    }
  };

  const sendMessage = async (url) => {
    const queryParams = new URLSearchParams(window.location.search);
    const shopId = queryParams.get("member") || "chat1"; // 默认为 chat1
    const messagesCollectionRef = collection(db, "chatroom", shopId, "messages");

    if (url !== undefined) {
      setTimeout(() => {
        dispatch({ type: "TOGGLE_IMG_LOADING" }); // 3 秒
        dispatch({ type: "TOGGLE_GPT_LOADING" });
        scrollToBottom();
      }, 500);
      await addDoc(messagesCollectionRef, {
        content: url,
        created_time: serverTimestamp(),
        from: "user1",
      });
    } else if (state.inputValue.trim() !== "") {
      await addDoc(messagesCollectionRef, {
        content: state.inputValue,
        created_time: serverTimestamp(),
        from: "user1",
      });

      let response = "";
      const matchedResponse = predefinedResponses.find(({ pattern }) => pattern.test(state.inputValue));

      if (matchedResponse) {
        response = matchedResponse.response;
        await addDoc(messagesCollectionRef, {
          content: response,
          created_time: serverTimestamp(),
          from: "shop",
        });
      } else if (url !== undefined) {
        fetchCustomGPTResponse(labels, messagesCollectionRef);
      } else {
        fetchCustomGPTResponse(state.inputValue, messagesCollectionRef);
      }

      dispatch({ type: "RESET_INPUT_VALUE" }); // 清空輸入框
      scrollToBottom();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const imageFormats = [".jpeg", ".jpg", ".png", ".gif"];

  const sendImage = (event) => {
    console.log(event.target.files);
    dispatch({ type: "TOGGLE_IMG_LOADING" });
    scrollToBottom();
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
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          sendMessage(downloadURL);
          try {
            await handleAnalyzeImage(downloadURL);
          } catch (error) {
            console.error("handleAnalyzeClick 發生錯誤：", error);
          }

          // scrollToBottom();
        });
      }
    );
  };
  useEffect(() => {
    if (labels.length > 0) {
      const queryParams = new URLSearchParams(window.location.search);
      const shopId = queryParams.get("member") || "chat1"; // 默认为 chat1
      const messagesCollectionRef = collection(db, "chatroom", shopId, "messages");
      fetchCustomGPTResponse(`圖片相關如下${labels}`, messagesCollectionRef);
      setTimeout(() => {
        dispatch({ type: "TOGGLE_GPT_LOADING" }); // 3 秒後觸發 dispatch
      }, 1000);
    }
  }, [labels]);

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
      <div className={`${state.showOrderInfo ? "grid" : "hidden"} bg-black-0 w-container py-2 px-3 grid-cols-4 gap-6 top-[68px] mt-[68px] left-0 right-0 z-10 my-0 mx-auto`}>
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
      <div className={`w-full product bg-white ${state.showShopInfo && !state.showOrderInfo ? "flex" : "hidden"} justify-center gap-6 py-2 mt-[68px] items-center`}>
        <img src={happy} alt="camera" className="w-20 rounded-full" />
        <div className="w4/6 my-2 flex flex-col py-2 justify-between">
          <h4 className="w-fit text-base font-bold leading-normal line-clamp-1">{state.shopName || "商家名稱未找到"}</h4>
          <p className="text-base leading-normal text-secondary">momoCall 回應率：100%</p>
        </div>
      </div>
      {/* 在滾動時顯示的日期標籤 */}
      {isScrolling && currentLabel && (
        <div className="fixed flex justify-center  top-[70px] left-0 right-0  z-10 ">
          <div className="bg-gray-300/85 rounded-full px-3 py-1 mb-3 shadow-lg">
            <p className="text-xs leading-normal">{currentLabel}</p>
          </div>
        </div>
      )}
      <div className={`px-3 py-4 space-y-4 ${state.divHeightClass} mb-[56px] min-h-screen`}>
        <div className="bg-accent flex justify-center items-center h-8 px-6 rounded-large">
          <FiAlertTriangle className="w-notice h-notice mr-4" />
          <p className="text-sm leading-normal">提醒您，請勿透露個人資料</p>
        </div>
        <div>
          <div className={`bg-black-0 p-4 rounded-t-lg ${state.showProductInfo ? "flex" : "hidden"} justify-between border-b-1 border-black-400`}>
            <img src={state.productInfo?.image} alt="product-image" className="w-middle h-middle rounded-lg mr-3" />
            <div className="flex flex-col grow justify-between">
              <p className={`text-xs leading-normal flex justify-between`}>
                商品編號 {state.productInfo?.productNumber} <span className={`${productNumber === null ? "inline" : "hidden"} text-primary-800 font-bold `}>推薦</span>
              </p>
              <p className="w-full h-[36px] text-xs leading-normal font-bold line-clamp-2">{state.productInfo?.productName || "商品名稱未找到"}</p>
            </div>
          </div>
          <div className={`bg-black-0 rounded-b-lg  ${state.showProductInfo ? "flex" : "hidden"} justify-center`}>
            <button className="w-full py-2 text-xs leading-normal font-bold text-primary cursor-pointer" onClick={() => dispatch({ type: "TO_PURCHASE" })}>
              立即購買
            </button>
          </div>
        </div>
        {state.messages.map((message, index) => {
          return (
            <div key={index} id={`message-${index}`}>
              <div key={index} className={`group flex gap-1 mr-3 relative ${message.from === "user1" ? "items-end flex-col" : "max-w-[258px] flex-wrap"}`}>
                {message.from !== "user1" && <img src={happy} alt="" className="w-9 h-9" />}
                <div
                  className={` w-fit max-w-52 text-black break-words rounded-lg p-3 relative ${message.from === "user1" ? "bg-white" : "bg-primary-600"} ${message.from === "user1" ? "" : "ml-2"} ${
                    message.from === "user1"
                      ? "after:absolute after:top-4 after:-right-3 after:content-[''] after:w-0 after:h-0 after:block after:border-b-[20px] after:border-l-[20px] after:border-l-white after:border-b-transparent"
                      : "after:absolute after:top-4 after:-left-3 after:content-[''] after:w-0 after:h-0 after:block after:border-b-[20px] after:border-r-[20px] after:border-r-primary-600 after:border-b-transparent"
                  }`}
                >
                  {imageFormats.some((format) => message.content.includes(format)) ? (
                    <PhotoProvider maskOpacity={0.5}>
                      <PhotoView src={message.content}>
                        <img src={message.content} alt="Sent" className="rounded-lg max-w-full h-auto" />
                      </PhotoView>
                    </PhotoProvider>
                  ) : (
                    <p dangerouslySetInnerHTML={{ __html: marked(message.content) }}></p>
                  )}
                </div>

                <small className={`${message.from === "user1" ? "" : "ml-12 "} h-6`}>
                  {message.created_time?.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "Loading..."}
                </small>
                <div className="flex self-center ">
                  <button
                    onClick={() => dispatch({ type: "TOGGLE_USEFUL", payload: { index, isUseful: "Yes" } })}
                    className={`${message.from === "user1" ? "hidden" : state.messages[index].isUseful === "No" ? "hidden" : "inline"} mx-2`}
                  >
                    <AiOutlineLike className={`${state.messages[index].isUseful === "Yes" ? "hidden" : "inline"}`} />
                    <AiFillLike className={`${state.messages[index].isUseful == "Yes" ? "inline" : "hidden"}`} />
                  </button>
                  <button
                    onClick={() => dispatch({ type: "TOGGLE_USEFUL", payload: { index, isUseful: "No" } })}
                    className={`${message.from === "user1" ? "hidden" : state.messages[index].isUseful === "Yes" ? "hidden" : "inline"} mx-2`}
                  >
                    <AiOutlineDislike className={`${state.messages[index].isUseful === "No" ? "hidden" : "inline"}`} />
                    <AiFillDislike className={`${state.messages[index].isUseful == "No" ? "inline" : "hidden"}`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <div className={`items-center flex gap-3 ${state.isImageLoading ? "flex flex-row-reverse" : state.isGPTLoading ? "flex" : "hidden"}`}>
          <img src={happy} alt="" className="w-9 h-9" />
          <img src={beenEater} alt="" className="w-14 h-14" />
          <img src={loading} alt="" className="-ml-7" />
        </div>
      </div>

      <div className={`${state.isChoose ? "flex" : "hidden"} justify-center items-center bg-black-800/80 w-container h-full fixed top-0`}>
        <div className="w-64 h-60 bg-white mx-auto py-2 px-4 flex flex-col gap-3 text-sm rounded-xl">
          <h4 className="text-center font-bold leading-normal text-base text-primary-800">請選擇規格數量</h4>
          <div className="bg-black-0 p-1 rounded-t-large flex justify-center items-center">
            <img
              src="https://images.unsplash.com/photo-1721020693392-e447ac5f52ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="product-image"
              className="w-small h-small rounded-lg mr-3"
            />
            <div className="flex flex-col justify-between">
              <p className="text-xs leading-normal">{state.productInfo?.productNumber}</p>
              <p className="text-xs leading-normal font-bold line-clamp-1">{state.productInfo?.productName || "商品名稱未找到"}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-around items-center">
              <label htmlFor="spec">規格</label>
              <select name="spec" id="spec" className="w-2/4 border-1 border-black-600 rounded-md text-center" onChange={(e) => dispatch({ type: "SELECT_SPEC", payload: e.target.value })}>
                <option value="yellow">{state.productInfo?.spec}</option>
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
              <p className="text-black-600 w-2/4 text-center">{state.productInfo?.price * state.count}</p>
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

      <div className={`${state.isPerchase ? "flex" : "hidden"} justify-center items-center w-container h-full fixed top-0`}>
        <div className="w-64 h-84 bg-white mx-auto py-2 px-4 flex flex-col gap-4 text-sm rounded-xl">
          <h4 className="text-center font-bold leading-normal text-lg text-primary-800 mt-2">訂單即將送出</h4>
          <p className="text-center font-bold">已確認品項、數量並進行結帳嗎？</p>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <p>產品名稱：</p>
              <p className="text-black-600 line-clamp-1 w-3/5 text-end">{state.productInfo?.productName || "商品名稱未找到"}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>數量：</p>
              <p className="text-black-600">{state.count}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>規格：</p>
              <p className="text-black-600">{state.productInfo?.spec}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>訂單金額：</p>
              <p className="text-black-600">{state.productInfo?.price * state.count || 0}</p>
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

      <div className={`${state.isCheckout ? "flex" : "hidden"} justify-center items-center w-container h-full fixed top-0 bg-black-800/80`}>
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
          onKeyDown={handleKeyDown}
        />
        <button className="bg-white w-8 h-8 rounded-full active:border-primary active:border" onClick={sendMessage}>
          <FiSend className="w-5 h-5 mx-auto text-primary hover:text-primary" />
        </button>
      </div>
    </div>
  );
}

export default Finish;
