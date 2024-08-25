import { FiImage } from "react-icons/fi";
import { FiSend } from "react-icons/fi";

function TypeIn() {
  return (
    <div className="bg-primary-600 py-2 px-3 flex gap-2 fixed bottom-0 w-[375px]">
      <button className="bg-white w-8 h-8 rounded-full active:border-primary active:border">
        <FiImage className="w-6 h-6 mx-auto text-primary hover:text-primary-800 " />
      </button>
      <input type="text" placeholder="輸入訊息" className="bg-bg-white grow rounded-3xl pl-3  focus:outline-primary focus:outline" />
      <button className="bg-white w-8 h-8 rounded-full active:border-primary active:border">
        <FiSend className="w-5 h-5 mx-auto text-primary hover:text-primary-800" />
      </button>
    </div>
  );
}

export default TypeIn;
