import happy from "./img/happy.png";
import product from "./img/product.jpg";
import { FiChevronLeft, FiAlertTriangle, FiImage, FiSend } from "react-icons/fi";

function ProductChat() {
  return (
    <div className=" font-TC w-[375px] mx-auto">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-container z-10">
        <div className="py-4 bg-black-200">
          <p className="text-center font-bold text-2xl relative text-primary">
            <FiChevronLeft className="absolute w-6 h-6 top-1 left-3 text-black" />
            對話紀錄
          </p>
        </div>
        <div className="product bg-white flex justify-center gap-6 py-2 items-center">
          <img src={happy} alt="camera" className="w-20 rounded-full" />
          <div className="my-2 flex flex-col py-2 justify-between">
            <h4 className="text-base font-bold leading-6">商家名稱最多也十六個字十六個字</h4>
            <p className="text-base leading-6 text-secondary">momoCall 回應率：100%</p>
          </div>
        </div>
      </div>
      <div className="mt-[160px] mb-12 bg-black-200 h-full py-4 px-3 flex flex-col gap-4">
        <p className="flex items-center bg-accent rounded-large text-center text-sm leading-normal py-1 ">
          <FiAlertTriangle className="w-notice h-notice ml-6 mr-4" />
          提醒您，請勿透露個人資料及私下議價報價
        </p>
        <p className=" bg-white rounded-large text-center  mx-auto w-14 ">今天</p>
        <div className="bg-white rounded-lg grid gap-x-3 grid-cols-[60px_1fr] items-center ">
          <img src={product} alt="product" className="w-middle ml-4" />
          <div className="text-xs leading-[18px] my-4 mx-4">
            <small>商品編號</small>
            <h4 className="font-bold text-ellipsis line-clamp-2">商品名稱商品名稱商品名稱商品名稱商品名稱商品名稱最多兩行共四十個字多的用刪節號喔</h4>
          </div>
          <button className="col-span-2 text-xs text-primary py-2 border-t font-bold">立即購買</button>
        </div>
        <div className=" flex gap-1">
          <img src={happy} alt="" className="w-9 h-9" />
          <p className="bg-primary-600 w-fit max-w-middle rounded-lg p-3 relative ml-2 after:absolute after:top-4 after:-left-3  after:content-[''] after:w-0 after:h-0 after:block  after:border-b-[20px] after:border-r-[20px] after:border-r-primary-600 after:border-b-transparent">
            一行最多放十三個字十三個字 十三個字十三個字十三個字
          </p>
          <small className="self-end">12:00</small>
        </div>
        <div className="flex gap-1 justify-end mr-3 ">
          <p className=" order-2 bg-white w-fit max-w-middle rounded-lg p-3 relative  after:absolute after:top-4 after:-right-3  after:content-[''] after:w-0 after:h-0 after:block  after:border-b-[20px] after:border-l-[20px] after:border-l-white after:border-b-transparent">
            一行最多放十三個字十三個字 十三個字十三個字十三個字
          </p>
          <small className="order-1 self-end">12:05</small>
        </div>
        <div className=" flex gap-1">
          <img src={happy} alt="" className="w-9 h-9" />
          <p className="bg-primary-600 w-fit max-w-middle rounded-lg p-3 relative ml-2 after:absolute after:top-4 after:-left-3  after:content-[''] after:w-0 after:h-0 after:block  after:border-b-[20px] after:border-r-[20px] after:border-r-primary-600 after:border-b-transparent">
            一行最多放十三個字十三個字
          </p>
          <small className="self-end">12:08</small>
        </div>
        <div className=" flex gap-1">
          <img src={happy} alt="" className="w-9 h-9" />
          <div className="grid grid-cols-1 w-fit max-w-middle p-1 bg-primary-600 rounded-lg">
            <img src={product} alt="" className=" mb-2 w-uploadImage h-uploadImage rounded object-cover object-bottom" />
            <small className="ml-2">商品編號</small>
            <h4 className="text-xs mb-2 ml-2">商品名稱商品名稱商品名稱十五字</h4>
          </div>
          <small className="self-end">12:08</small>
        </div>
      </div>
      <div className="bg-primary-600 py-2 px-3 flex gap-2 fixed bottom-0 w-container">
        <button className="bg-white w-8 h-8 rounded-full active:border-primary active:border">
          <FiImage className="w-6 h-6 mx-auto text-primary hover:text-primary " />
        </button>
        <input type="text" placeholder="輸入訊息" className="bg-black-200 grow rounded-3xl pl-3  focus:outline-primary focus:outline focus:bg-white hover:bg-white" />
        <button className="bg-white w-8 h-8 rounded-full active:border-primary active:border">
          <FiSend className="w-5 h-5 mx-auto text-primary hover:text-primary" />
        </button>
      </div>
    </div>
  );
}

export default ProductChat;
