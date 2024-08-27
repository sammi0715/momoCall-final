import { FiChevronLeft } from "react-icons/fi";
import { FiAlertTriangle } from "react-icons/fi";
import { FiImage } from "react-icons/fi";
import { FiSend } from "react-icons/fi";
import annoy from "../images/annoy.png";
import happy from "./img/happy.png";
import { database, storage } from "../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useReducer } from "react";

const initialState = {
  purchase: false,
  checkout: false,
  count: 0,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "purchase": {
      return { ...state, purchase: !state.purchase };
    }
    case "checkout": {
      return { ...state, checkout: !state.checkout };
    }
    case "addProduct": {
      return { ...state, count: state.count + 1 };
    }
    case "subProduct": {
      return { ...state, count: state.count - 1 };
    }
    default:
      return state;
  }
};
function Finish() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const setChats = async (url) => {
    try {
      const messagesRef = collection(database, "chatroom", "chat1", "messages");
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
        });
      }
    );
  };

  return (
    <div className="bg-black-200 w-container h-100 my-0 mx-auto relative font-sans">
      <div className="bg-black-200 w-container px-3 fixed top-0 left-0 right-0 z-10 my-0 mx-auto">
        <div className="flex items-center py-4">
          <FiChevronLeft className="w-6 h-6 mr-3 cursor-pointer" />
          <h1 className="font-sans font-bold text-2xl leading-normal text-primary ml-20">對話紀錄</h1>
        </div>
      </div>

      {/* 這裡要做選擇，hidden or grid */}
      <div className="hidden bg-black-0 w-container py-2 px-3  grid-cols-4 gap-6 fixed top-[68px] left-0 right-0 z-10 my-0 mx-auto">
        <div className="flex flex-col items-center gap-y-2 col-span-1">
          <img src="https://images.unsplash.com/photo-1635865933730-e5817b5680cd?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="product-image" className="rounded-full w-large h-large" />
          <p className="text-xs leading-normal text-center w-large bg-secondary-400 text-secondary rounded-lg">訂單成立</p>
        </div>
        <div className="flex flex-col gap-y-1 col-span-3">
          <p className="font-bold">商品名稱一行最多十七個字商品名稱一行最多十七個字</p>
          <p className="text-primary">NT. 499</p>
          <p>訂單編號：20240823153700</p>
        </div>
      </div>
      {/* 這裡要做選擇，hidden or flex */}
      <div className="product bg-white hidden justify-center gap-6 py-2 items-center">
        <img src={happy} alt="camera" className="w-20 rounded-full" />
        <div className="my-2 flex flex-col py-2 justify-between">
          <h4 className="text-base font-bold leading-normal">商家名稱最多也十六個字十六個字</h4>
          <p className="text-base leading-normal text-secondary">momoCall 回應率：100%</p>
        </div>
      </div>

      <div className="px-3 py-4 space-y-4 mt-[68px] mb-12">
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
          <div className="bg-black-0 p-4 rounded-t-large flex justify-between border-b-1 border-black-400">
            <img src="https://images.unsplash.com/photo-1721020693392-e447ac5f52ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="product-image" className="w-middle h-middle rounded-lg mr-3" />
            <div className="flex flex-col justify-between">
              <p className="text-xs leading-normal">商品編號</p>
              <p className="text-xs leading-normal font-bold">商品名稱商品名稱商品名稱商品名稱商品名稱商品名稱最多兩行共四十個字多的用刪節號喔</p>
            </div>
          </div>
          <div className="bg-black-0 rounded-b-lg flex justify-center">
            <button className="w-full py-2 text-xs leading-normal font-bold text-primary cursor-pointer" onClick={() => dispatch({ type: "purchase" })}>
              立即購買
            </button>
          </div>
        </div>

        <div className="flex gap-x-1">
          <img src={annoy} alt="shopper-profile-image" className="w-small h-small rounded-full mr-1 bg-primary-600" />
          <p className="bg-primary-600 w-chatBox rounded-lg text-sm leading-normal p-3 relative ml-2 after:absolute after:top-4 after:-left-3  after:content-[''] after:w-0 after:h-0 after:block  after:border-b-[20px] after:border-r-[20px] after:border-r-primary-600 after:border-b-transparent">
            一行最多放十三個字十三個字十三個字十三個字十三個字
          </p>
          <p className="text-xs leading-normal text-black-800 self-end">12:00</p>
        </div>
        <div className="flex flex-row-reverse gap-1">
          <p className="bg-black-0 w-chatBox rounded-lg text-sm leading-normal p-3 relative mr-3 after:absolute after:top-4 after:-right-3 after:content-[''] after:w-0 after:h-0 after:block after:border-b-[20px] after:border-l-[20px] after:border-l-black-0 after:border-b-transparent">
            一行最多放十三個字十三個字 十三個字十三個字十三個字
          </p>
          <p className="text-xs leading-normal text-black-800 self-end">12:05</p>
        </div>
        <div className="flex gap-x-1">
          <img src={annoy} alt="shopper-profile-image" className="w-9 h-9 rounded-full mr-1 bg-primary-600" />
          <p className="bg-primary-600 w-chatBox rounded-lg text-sm leading-normal p-3 relative ml-2 after:absolute after:top-4 after:-left-3  after:content-[''] after:w-0 after:h-0 after:block  after:border-b-[20px] after:border-r-[20px] after:border-r-primary-600 after:border-b-transparent">
            一行最多放十三個字十三個字
          </p>
          <p className="text-xs leading-normal text-black-800 self-end">12:08</p>
        </div>
        <div className="flex gap-x-1">
          <img src={annoy} alt="shopper-profile-image" className="w-9 h-9 rounded-full mr-3 bg-primary-600" />
          <div className="bg-primary-600 w-chatBox rounded-lg p-1">
            <img src="https://images.unsplash.com/photo-1721020693392-e447ac5f52ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="product-image" className="w-uploadImage h-uploadImage rounded mb-1" />
            <div className="p-1">
              <p className="text-xs leading-normal">商品編號</p>
              <p className="text-xs leading-normal">商品名稱商品名稱商品名稱十五字</p>
            </div>
          </div>
          <p className="text-xs leading-normal text-black-800 self-end">12:08</p>
        </div>
      </div>

      <div className={`${state.purchase ? "flex" : "hidden"} justify-center items-center bg-black-800/80 w-container h-full  fixed top-0`}>
        <div className="w-64 h-2/5 bg-white mx-auto py-2 px-4 flex flex-col gap-4 text-sm rounded-xl">
          <h4 className="text-center font-bold leading-normal text-base text-primary-800">請選擇規格數量</h4>
          <div className="bg-black-0 p-1 rounded-t-large flex justify-center items-center">
            <img src="https://images.unsplash.com/photo-1721020693392-e447ac5f52ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="product-image" className="w-small h-small rounded-lg mr-3" />
            <div className="flex flex-col justify-between">
              <p className="text-xs leading-normal">123456</p>
              <p className="text-xs leading-normal font-bold">商品名稱商品名稱商品名稱</p>
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
                <button onClick={() => dispatch({ type: "subProduct" })}>-</button>
                <p className="leading-normal">{state.count}</p>
                <button onClick={() => dispatch({ type: "addProduct" })}>+</button>
              </div>
            </div>
            <div className="flex justify-around items-center">
              <p>總金額：</p>
              <p className="text-black-600 w-2/4 text-center">1000元</p>
            </div>
          </div>
          <div className="flex justify-around items-center">
            <button onClick={() => dispatch({ type: "purchase" })}>取消</button>
            <button onClick={() => dispatch({ type: "checkout" })} className="text-primary-800 font-bold">
              下一步
            </button>
          </div>
        </div>
      </div>

      <div className={`${state.checkout ? "flex" : "hidden"} justify-center items-center  w-container h-full  fixed top-0`}>
        <div className="w-64 h-2/5 bg-white mx-auto py-2 px-4 flex flex-col gap-4 text-sm rounded-xl">
          <h4 className="text-center font-bold leading-normal text-base text-primary-800">訂單即將送出</h4>
          <p className="text-center font-bold">已確認品項、數量並前往結帳嗎？</p>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <p>產品名稱：</p>
              <p className="text-black-600">我是產品</p>
            </div>
            <div className="flex justify-between items-center">
              <p>數量：</p>
              <p className="text-black-600">{state.count}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>訂單金額：</p>
              <p className="text-black-600">1000元</p>
            </div>
          </div>
          <small className="text-center text-black-600">提醒您，請於十分鐘內進行結帳</small>
          <div className="flex justify-around items-center">
            <button onClick={() => dispatch({ type: "checkout" })}>上一步</button>
            <button className="text-primary-800 font-bold">確認</button>
          </div>
        </div>
      </div>

      <div className="bg-primary-600 w-container py-2 px-3 flex justify-between gap-x-2 fixed bottom-0 left-0 right-0 z-10 my-0 mx-auto">
        <label className="bg-black-0 rounded-full p-1 cursor-pointer active:outline active:outline-primary active:outline-1 active:outline-offset-0">
          <FiImage className="w-6 h-6 text-primary hover:text-primary-800 active:text-primary" />
          <input type="file" className="hidden" accept="image/jpg,image/jpeg,image/png,image/gif" onChange={sendImage} />
        </label>
        <input type="text" className="rounded-large text-sm leading-normal bg-black-200 px-3 w-full placeholder:text-black hover:bg-black-0 focus:border-1 focus:bg-black-0 focus:border-primary focus:outline-none" placeholder="輸入訊息" />
        <button type="button" className="bg-black-0 rounded-full p-1 cursor-pointer active:outline active:outline-primary active:outline-1 active:outline-offset-0">
          <FiSend className="w-6 h-6 text-primary hover:text-primary-800 active:text-primary" />
        </button>
      </div>
    </div>
  );
}

export default Finish;
