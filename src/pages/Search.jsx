import React from "react";
import { FiChevronLeft } from "react-icons/fi";
import momoLogo from "/momocallLogo.png";

const SearchPages = () => {
  return (
    <div className="w-[375px] max-w-screen min-h-screen m-[auto] bg-white justify-center p-3 pt-0 font-TC">
      <header className="flex items-center h-[68px]">
        <button className="flex-shrink-0">
          <FiChevronLeft size={24} />
        </button>
        <h1 className="text-2xl leading-9 font-bold flex-grow text-center text-primary">
          momoCall
        </h1>
      </header>

      <input
        type="text"
        placeholder="請輸入商店名稱, 商品名稱或商品編號"
        className="w-[351px] h-[32px] text-sm text-black-100 text-center bg-black-40 placeholder-black-100 rounded-full mb-4 hover:bg-black-20 focus:outline outline-black-60"
      />
      <div>
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="w-[351px] h-[101px] flex items-center border-t border-gray-300"
          >
            <img
              className="w-[70px] h-[70px] rounded-full"
              src={momoLogo}
            ></img>

            <div className="flex grow pl-4 justify-between">
              <div className="flex flex-col justify-between">
                <div className="flex justify-between">
                  <h2 className="text-base font-bold text-primary">
                    商家名稱最多也十二個字喔
                  </h2>
                  <p className="text-xs text-gray-500 ml-[30px]">08/23</p>
                </div>
                <div className="flex justify-between mt-1.5">
                  <p className="text-sm text-gray-500">
                    聊天內容最多十二個字喔哈
                  </p>
                  <div className="bg-primary-800 text-black-0 text-base w-6 h-6 rounded-full flex items-center justify-center ml-2 ">
                    2
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SearchPages;
