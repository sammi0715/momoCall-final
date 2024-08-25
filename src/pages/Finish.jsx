import { FiChevronLeft } from "react-icons/fi";

function Finish() {
  return (
    <div className="bg-black-200 w-container h-100 my-0 mx-auto relative">
      <div className="bg-black-200 w-container px-3 fixed top-0 left-0 right-0 my-0 mx-auto">
        <div className="flex items-center py-4">
          <FiChevronLeft className="w-6 h-6 mr-3 cursor-pointer" />
          <h1 className="font-sans font-bold text-2xl leading-normal text-primary ml-20">
            對話紀錄
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Finish;
