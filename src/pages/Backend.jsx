import { Link } from "react-router-dom";
import { FiChevronLeft, FiPenTool, FiPlus } from "react-icons/fi";
import { useState } from "react";

function Backend() {
  const [openId, setOpenId] = useState(null);

  const toggleCollapse = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-container max-w-screen h-screen m-[auto] bg-white flex flex-col p-3 pt-0 font-sans">
      <header className="flex items-center py-4">
        <Link to="/">
          <button className="mr-3">
            <FiChevronLeft className="w-6 h-6" />
          </button>
        </Link>
        <Link to="/">
          <h1 className="text-2xl leading-normal font-bold text-primary ml-12">momoCallback</h1>
        </Link>
      </header>
      <input
        type="text"
        placeholder="請輸入提問關鍵字"
        className="leading-normal w-full py-[5.5px] text-sm text-black-100 text-center bg-black-200 placeholder-black-600 rounded-full mb-4 hover:bg-black-200 focus:outline outline-black-600 focus:bg-black-200"
      />
      <div className="flex-grow overflow-scroll bg-black-200 p-3 rounded-t-lg">
        <div className="space-y-3">
          <div>
            <div className="bg-primary-600 rounded-lg py-2 px-4 flex justify-between items-center cursor-pointer" onClick={() => toggleCollapse(1)}>
              <p className="text-black text-base leading-normal">離島</p>
              <FiPenTool className="w-6 h-6 hover:text-primary" />
            </div>
            <div className={`bg-black-0 rounded-lg px-4 transition-max-height duration-300 ease-in overflow-hidden ${openId === 1 ? "max-h-screen py-2 mt-2" : "max-h-0"}`}>
              <p className="text-black text-base leading-normal">
                有「速」標誌商品皆可離島全區配送，單一商品材積限制：長＋寬＋高需低於120公分；單一商品重量限制：需低於20公斤； 離島配送物流費90元，若有一般宅配和快速到貨同時結帳，最高收取 180
                元（後續發生退款者，運費將不予以退還）；配送時間：約3個工作天。
              </p>
            </div>
          </div>
          <div>
            <div className="bg-primary-600 rounded-lg py-2 px-4 flex justify-between items-center cursor-pointer" onClick={() => toggleCollapse(2)}>
              <p className="text-black text-base leading-normal">離島</p>
              <FiPenTool className="w-6 h-6 hover:text-primary" />
            </div>
            <div className={`bg-black-0 rounded-lg px-4 transition-max-height duration-300 ease-in overflow-hidden ${openId === 2 ? "max-h-screen py-2 mt-2" : "max-h-0"}`}>
              <p className="text-black text-base leading-normal">
                有「速」標誌商品皆可離島全區配送，單一商品材積限制：長＋寬＋高需低於120公分；單一商品重量限制：需低於20公斤； 離島配送物流費90元，若有一般宅配和快速到貨同時結帳，最高收取 180
                元（後續發生退款者，運費將不予以退還）；配送時間：約3個工作天。
              </p>
            </div>
          </div>
          <div>
            <div className="bg-primary-600 rounded-lg py-2 px-4 flex justify-between items-center cursor-pointer" onClick={() => toggleCollapse(3)}>
              <p className="text-black text-base leading-normal">離島</p>
              <FiPenTool className="w-6 h-6 hover:text-primary" />
            </div>
            <div className={`bg-black-0 rounded-lg px-4 transition-max-height duration-300 ease-in overflow-hidden ${openId === 3 ? "max-h-screen py-2 mt-2" : "max-h-0"}`}>
              <p className="text-black text-base leading-normal">
                有「速」標誌商品皆可離島全區配送，單一商品材積限制：長＋寬＋高需低於120公分；單一商品重量限制：需低於20公斤； 離島配送物流費90元，若有一般宅配和快速到貨同時結帳，最高收取 180
                元（後續發生退款者，運費將不予以退還）；配送時間：約3個工作天。
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black-200 rounded-b-lg pb-3 px-3">
        <button className="w-full py-2 px-4 rounded-lg flex items-center cursor-pointer hover:bg-black-400">
          <FiPlus className="w-6 h-6 hover:text-primary mr-1" />
          <p className="text-base leading-normal font-bold">新增問答</p>
        </button>
      </div>
    </div>
  );
}

export default Backend;
