import { ChatContext, ChatDispatchContext } from "../../chatContextProvider";
import { useContext } from "react";
import { FiImage, FiSend } from "react-icons/fi";
import PropTypes from "prop-types";

function TypeIn({ sendImage, handleKeyDown, sendMessage }) {
  const { state } = useContext(ChatContext);
  const { dispatch } = useContext(ChatDispatchContext);

  return (
    <div className="bg-primary-600 w-container py-3 px-3 flex justify-between gap-x-2 fixed bottom-0 left-0 right-0 z-10 my-0 mx-auto">
      <label className="bg-black-0 rounded-full p-1 cursor-pointer active:outline active:outline-primary active:outline-1 active:outline-offset-0">
        <FiImage className="w-6 h-6 text-primary hover:text-primary-800 active:text-primary" />
        <input type="file" className="w-6 h-6 hidden" accept="image/jpg,image/jpeg,image/png,image/gif" onChange={sendImage} />
      </label>
      <input
        type="text"
        className="w-[271px] bg-black-200 grow rounded-3xl pl-3 border-0 focus:outline-primary focus:outline focus:outline-1 focus:outline-offset-0 focus:bg-white hover:bg-white"
        placeholder="輸入訊息"
        value={state.inputValue}
        onChange={(e) => dispatch({ type: "SET_INPUT_VALUE", payload: e.target.value })}
        onKeyDown={handleKeyDown}
      />
      <button className="bg-white w-8 h-8 rounded-full active:border-primary active:border" onClick={sendMessage}>
        <FiSend className="w-5 h-5 mx-auto text-primary hover:text-primary" />
      </button>
    </div>
  );
}

TypeIn.propTypes = {
  sendImage: PropTypes.func.isRequired,
  handleKeyDown: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
};
export default TypeIn;
