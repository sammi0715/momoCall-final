import { FiImage } from "react-icons/fi";
import { FiSend } from "react-icons/fi";

function TypeIn() {
  return (
    <div className="bg-white py-2 px-3 flex gap-2">
      <button className="bg-black-600 w-8 h-8 rounded-full">
        <FiImage className="w-6 h-6 mx-auto text-primary" />
      </button>
      <input type="text" placeholder="輸入訊息" className="bg-black-600 grow rounded-3xl pl-3" />
      <button className="bg-black-600 w-8 h-8 rounded-full">
        <FiSend className="w-5 h-5 mx-auto text-primary" />
      </button>
    </div>
  );
}

export default TypeIn;
