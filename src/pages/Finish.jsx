import { FiChevronLeft } from "react-icons/fi";
import { FiAlertTriangle } from "react-icons/fi";
import { FiImage } from "react-icons/fi";
import { FiSend } from "react-icons/fi";
import annoy from "../images/annoy.png";

function Finish() {
  return (
    <div className="bg-black-200 w-container h-100 my-0 mx-auto relative font-sans">
      <div className="bg-black-200 w-container px-3 fixed top-0 left-0 right-0 z-10 my-0 mx-auto">
        <div className="flex items-center py-4">
          <FiChevronLeft className="w-6 h-6 mr-3 cursor-pointer" />
          <h1 className="font-sans font-bold text-2xl leading-normal text-primary ml-20">對話紀錄</h1>
        </div>
      </div>
      <div className="bg-black-0 w-container py-2 px-3 grid grid-cols-4 gap-6 fixed top-[68px] left-0 right-0 z-10 my-0 mx-auto">
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
      <div className="px-3 py-4 space-y-4 mt-[188px] mb-12">
        <div className="bg-accent flex justify-between items-center h-8 px-6 rounded-large">
          <FiAlertTriangle className="w-notice h-notice" />
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
            <button className="w-full py-2 text-xs leading-normal font-bold text-primary cursor-pointer">立即購買</button>
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
      <div className="bg-primary-600 w-container py-2 px-3 flex justify-between gap-x-2 fixed bottom-0 left-0 right-0 z-10 my-0 mx-auto">
        <label className="bg-black-0 rounded-full p-1 cursor-pointer active:outline active:outline-primary active:outline-1 active:outline-offset-0">
          <FiImage className="w-6 h-6 text-primary hover:text-primary-800 active:text-primary" />
          <input type="file" className="hidden" />
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
