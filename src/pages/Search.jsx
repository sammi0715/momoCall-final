import { FiChevronLeft } from "react-icons/fi";
import momoLogo from "/momocallLogo.png";

const SearchPages = () => {
  return (
    <div className="w-container max-w-screen min-h-screen m-[auto] bg-white justify-center p-3 pt-0 font-sans">
      <header className="flex items-center h-[68px]">
        <button className="flex-shrink-0">
          <FiChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl leading-normal font-bold flex-grow text-center text-primary">
          momoCall
        </h1>
      </header>

      <input
        type="text"
        placeholder="請輸入商店名稱，商品名稱或商品編號"
        className="leading-normal w-full h-8 text-sm text-black-100 text-center bg-black-400 placeholder-black rounded-full mb-4 hover:bg-black-200 focus:outline outline-black-600 focus:bg-black-200"
      />
      <div>
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="w-[351px] h-[101px] flex items-center border-t border-gray-300"
          >
            <img className="w-large h-large rounded-full" src={momoLogo}></img>

            <div className="flex grow pl-4 flex-col py-3 justify-between">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-bold text-primary leading-normal">
                  商家名稱最多也十二個字喔
                </h2>
                <p className="text-xs text-gray-500  leading-normal">08/23</p>
              </div>
              <div className="flex justify-between mt-1.5">
                <p className="text-sm text-gray-500 leading-normal">
                  聊天內容最多十二個字喔哈
                </p>
                <div className="bg-primary-800 text-black-0 text-base w-6 h-6 rounded-full flex items-center justify-center ml-2 ">
                  2
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
