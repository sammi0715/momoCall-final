import { FiChevronLeft } from "react-icons/fi";
import { FiAlertTriangle } from "react-icons/fi";

function Finish() {
  return (
    <div className="bg-black-200 w-container h-100 my-0 mx-auto relative">
      <div className="bg-black-200 w-container px-3 fixed top-0 left-0 right-0 z-10 my-0 mx-auto">
        <div className="flex items-center py-4">
          <FiChevronLeft className="w-6 h-6 mr-3 cursor-pointer" />
          <h1 className="font-sans font-bold text-2xl leading-normal text-primary ml-20">
            對話紀錄
          </h1>
        </div>
      </div>
      <div className="bg-black-0 w-custom py-2 px-3 grid grid-cols-4 gap-6 fixed top-[68px] left-0 right-0 z-10 my-0 mx-auto">
        <div className="flex flex-col items-center gap-y-2 col-span-1">
          <img
            src="https://images.unsplash.com/photo-1635865933730-e5817b5680cd?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="product-image"
            className="rounded-full w-large h-large"
          />
          <p className="text-xs leading-normal text-center w-large bg-secondary-400 text-secondary rounded-lg">
            訂單成立
          </p>
        </div>
        <div className="flex flex-col gap-y-1 col-span-3">
          <p className="font-bold">
            商品名稱一行最多十七個字商品名稱一行最多十七個字
          </p>
          <p className="text-primary">NT. 499</p>
          <p>訂單編號：20240823153700</p>
        </div>
      </div>
      <div className="px-3 py-4 space-y-4 mt-[188px] mb-12">
        <div className="bg-accent flex justify-between items-center h-8 px-6 rounded-large">
          <FiAlertTriangle className="w-notice h-notice" />
          <p className="text-sm leading-normal">
            提醒您，請勿透露個人資料及私下議價報價
          </p>
        </div>
      </div>
    </div>
  );
}

export default Finish;
