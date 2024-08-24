import product from "./img/product.jpg";
import happy from "./img/happy.png";
import { FiAlertTriangle } from "react-icons/fi";

function Chat() {
  return (
    <div className="mt-[160px] bg-black-600 h-full py-4 px-3 flex flex-col gap-4">
      <p className="flex items-center bg-white rounded-[20px] text-center text-sm leading-5 py-1 ">
        <FiAlertTriangle className="w-5 h-5 ml-6 mr-4" />
        提醒您，請勿透露個人資料及私下議價報價
      </p>
      <p className=" bg-white rounded-[20px] text-center  mx-auto w-14 ">今天</p>
      <div className="bg-slate-50 rounded-lg grid gap-x-3 grid-cols-[60px_1fr] items-center ">
        <img src={product} alt="product" className="w-[60px] ml-4" />
        <div className="text-xs leading-[18px] my-4 mx-4">
          <small>商品編號</small>
          <h4 className="font-bold text-ellipsis line-clamp-2">商品名稱商品名稱商品名稱商品名稱商品名稱商品名稱最多兩行共四十個字多的用刪節號喔</h4>
        </div>
        <button className="col-span-2 text-xs text-primary/100 py-2 border-t">立即購買</button>
      </div>
      <div className=" flex gap-1">
        <img src={happy} alt="" className="w-9 h-9" />
        <p className="bg-white w-fit max-w-60 rounded-lg p-3 relative ml-2 after:absolute after:top-4 after:-left-3  after:content-[''] after:w-0 after:h-0 after:block  after:border-b-[20px] after:border-r-[20px] after:border-r-white after:border-b-transparent">
          一行最多放十三個字十三個字 十三個字十三個字十三個字
        </p>
        <small className="self-end">12:00</small>
      </div>
      <div className="flex gap-1 justify-end mr-3 ">
        <p className=" order-2 bg-white w-fit max-w-60 rounded-lg p-3 relative  after:absolute after:top-4 after:-right-3  after:content-[''] after:w-0 after:h-0 after:block  after:border-b-[20px] after:border-l-[20px] after:border-l-white after:border-b-transparent">
          一行最多放十三個字十三個字 十三個字十三個字十三個字
        </p>
        <small className="order-1 self-end">12:05</small>
      </div>
      <div className=" flex gap-1">
        <img src={happy} alt="" className="w-9 h-9" />
        <p className="bg-white w-fit max-w-60 rounded-lg p-3 relative ml-2 after:absolute after:top-4 after:-left-3  after:content-[''] after:w-0 after:h-0 after:block  after:border-b-[20px] after:border-r-[20px] after:border-r-white after:border-b-transparent">一行最多放十三個字十三個字</p>
        <small className="self-end">12:08</small>
      </div>
      <div className=" flex gap-1">
        <img src={happy} alt="" className="w-9 h-9" />
        <div className="grid grid-cols-1 w-fit max-w-60 p-1 bg-white rounded-lg">
          <img src={product} alt="" className=" mb-2 w-60 h-36 rounded-lg object-cover object-bottom" />
          <small className="ml-2">商品編號</small>
          <h4 className="text-xs mb-2 ml-2">商品名稱商品名稱商品名稱十五字</h4>
        </div>
        <small className="self-end">12:00</small>
      </div>
    </div>
  );
}

export default Chat;
