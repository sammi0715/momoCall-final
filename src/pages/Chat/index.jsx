import { useEffect, useContext } from "react";
import { ChatContext, ChatDispatchContext } from "../chatContext";
import responses from "./responses.json";
import { db, storage, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDocs, where, ref, uploadBytesResumable, getDownloadURL } from "../utils/firebase";
import useGoogleVisionAPI from "../utils/useGoogleVisionAPI";
import tappay from "../utils/tappay";
import { format, isToday, isYesterday, differenceInMinutes } from "date-fns";
import { zhTW } from "date-fns/locale";
import "react-photo-view/dist/react-photo-view.css";

import Header from "./Chat/Header";
import OrderCard from "./Chat/OrderCard";
import ShopCard from "./Chat/ShopCard";
import DateLabel from "./Chat/DateLabel";
import ChatSection from "./Chat/ChatSection";
import Choose from "./Chat/Choose";
import Checkout from "./Chat/Checkout";
import Order from "./Chat/Order";
import TypeIn from "./Chat/TypeIn";

function Chat() {
  const { labels, handleAnalyzeImage } = useGoogleVisionAPI();
  const queryParams = new URLSearchParams(window.location.search);
  const shopId = queryParams.get("member");
  const orderNumber = queryParams.get("order");
  const productNumber = queryParams.get("product");

  const state = useContext(ChatContext);
  const { dispatch, scrollToBottom } = useContext(ChatDispatchContext);

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

  useEffect(() => {
    if (shopId) {
      dispatch({ type: "TOGGLE_SHOP_INFO", payload: true });
      fetchProductInfo(shopId, productNumber);
      if (orderNumber) {
        dispatch({ type: "TOGGLE_ORDER_INFO", payload: true });
        fetchOrderInfo(shopId, orderNumber);
      } else {
        dispatch({ type: "TOGGLE_SHOP_INFO", payload: true });
        dispatch({ type: "TOGGLE_PRODUCT_INFO", payload: true });
        fetchProductInfo(shopId, productNumber);
      }
    } else {
      dispatch({ type: "TOGGLE_ORDER_INFO", payload: false });
      dispatch({ type: "TOGGLE_PRODUCT_INFO", payload: false });
    }

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

    const setupTappay = async () => {
      await tappay.setupSDK();
      tappay.setupCard();
    };

    setupTappay();
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let hasSentMessage = false;

    const sendQAMessage = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const shopId = queryParams.get("member");
      const messagesCollectionRef = collection(db, "chatroom", shopId, "messages");

      if (!hasSentMessage) {
        const qaMessage = {
          content: `歡迎來到${state.shopName}！我是你的 AI 小幫手，你可以先從選單了解我們的服務～`,
          created_time: serverTimestamp(),
          from: "shop",
          isQA: true,
        };
        await addDoc(messagesCollectionRef, qaMessage);

        hasSentMessage = true;
      }
    };

    if (state.shopName) {
      sendQAMessage();
    }
  }, [state.shopName]);

  let scrollTimeout;

  useEffect(() => {
    if (state.messages.length > 0) {
      const handleScroll = () => {
        dispatch({ type: "SET_IS_SCROLLING", payload: true });
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
        dispatch({ type: "SET_DATE_LABEL", payload: newLabel });

        scrollTimeout = setTimeout(() => {
          dispatch({ type: "SET_IS_SCROLLING", payload: false });
        }, 900);
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [state.messages]);

  const predefinedResponses = responses.map((item) => ({
    pattern: new RegExp(item.pattern, "i"),
    response: item.response,
  }));

  const addMessage = async (document, content, from) => {
    await addDoc(document, {
      content: content,
      created_time: serverTimestamp(),
      from: from,
      isUsefull: "",
    });
  };

  const fetchGPT = async (inputText, document) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    try {
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
        await addMessage(document, data.choices[0].message.content, "shop");
      } else if (res.status === 429) {
        console.error("Too many requests. Please try again later.");
        dispatch({ type: "SET_GPT_ERROR", payload: "Too many requests. Please try again later." });
      } else {
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
    const shopId = queryParams.get("member");
    const messagesCollectionRef = collection(db, "chatroom", shopId, "messages");

    if (url !== undefined) {
      setTimeout(() => {
        dispatch({ type: "TOGGLE_IMG_LOADING" });
        dispatch({ type: "TOGGLE_GPT_LOADING" });
        scrollToBottom();
      }, 500);

      await addMessage(messagesCollectionRef, url, "user1");
    } else if (state.inputValue.trim() !== "") {
      await addMessage(messagesCollectionRef, state.inputValue, "user1");

      let response = "";
      const matchedResponse = predefinedResponses.find(({ pattern }) => pattern.test(state.inputValue));

      if (matchedResponse) {
        response = matchedResponse.response;
        await addMessage(messagesCollectionRef, response, "shop");
      } else if (url !== undefined) {
        fetchGPT(labels, messagesCollectionRef);
      } else {
        fetchGPT(state.inputValue, messagesCollectionRef);
      }

      dispatch({ type: "RESET_INPUT_VALUE" });
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
        });
      }
    );
  };

  useEffect(() => {
    if (labels.length > 0) {
      const messagesCollectionRef = collection(db, "chatroom", shopId, "messages");
      fetchGPT(`圖片相關如下${labels}`, messagesCollectionRef);
      setTimeout(() => {
        dispatch({ type: "TOGGLE_GPT_LOADING" });
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
      <Header />
      <OrderCard />
      <ShopCard />
      <DateLabel />
      <ChatSection productNumber={productNumber} imageFormats={imageFormats} />
      <Choose />
      <Checkout checkout={checkout} />
      <Order />
      <TypeIn sendImage={sendImage} handleKeyDown={handleKeyDown} sendMessage={sendMessage} />
    </div>
  );
}

export default Chat;
