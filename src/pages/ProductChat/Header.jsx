import happy from "./img/happy.png";
import { FiChevronLeft } from "react-icons/fi";

function Header() {
  return (
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
  );
}

export default Header;
