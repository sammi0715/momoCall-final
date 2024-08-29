import { Link } from "react-router-dom";
import { FiChevronLeft, FiPenTool, FiPlus, FiX } from "react-icons/fi";
import { useState, useRef } from "react";

function Backend() {
  const [openId, setOpenId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const textareaRef = useRef(null);

  const toggleCollapse = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const handleTextareaInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const toggleModal = (input = "", textarea = "") => {
    setInputValue(input);
    setTextareaValue(textarea);
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = () => {
    if (inputValue && textareaValue) {
      console.log("送出成功");
      toggleModal();
      setInputValue("");
      setTextareaValue("");
    } else {
      alert("請填寫所有欄位");
    }
  };

  return (
    <div className="w-container max-w-screen h-screen m-[auto] bg-white flex flex-col p-3 pt-0 font-sans relative">
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
              <button
                className="cursor-pointer"
                onClick={() =>
                  toggleModal(
                    "離島",
                    "有「速」標誌商品皆可離島全區配送，單一商品材積限制：長＋寬＋高需低於120公分；單一商品重量限制：需低於20公斤； 離島配送物流費90元，若有一般宅配和快速到貨同時結帳，最高收取 180 元（後續發生退款者，運費將不予以退還）；配送時間：約3個工作天。"
                  )
                }
              >
                <FiPenTool className="w-6 h-6 hover:text-primary" />
              </button>
            </div>
            <div className={`bg-black-0 rounded-lg px-4 transition-max-height duration-300 ease-in overflow-hidden ${openId === 1 ? "max-h-screen py-2 mt-2" : "max-h-0"}`}>
              <p className="text-black text-base leading-normal">
                有「速」標誌商品皆可離島全區配送，單一商品材積限制：長＋寬＋高需低於120公分；單一商品重量限制：需低於20公斤； 離島配送物流費90元，若有一般宅配和快速到貨同時結帳，最高收取 180
                元（後續發生退款者，運費將不予以退還）；配送時間：約3個工作天。
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black-200 rounded-b-lg py-3 px-3">
        <button className="w-full py-2 px-4 rounded-lg flex items-center cursor-pointer hover:bg-black-400" onClick={() => toggleModal()}>
          <FiPlus className="w-6 h-6 mr-1" />
          <p className="text-base leading-normal font-bold">新增問答</p>
        </button>
      </div>
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
          <div className="bg-black-0 rounded-lg w-[319px] h-fit py-3 px-4 space-y-2 absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="flex justify-between items-center">
              <p className="text-base leading-normal">新增問答</p>
              <FiX className="w-6 h-6 text-black hover:text-red-600 cursor-pointer" onClick={toggleModal} />
            </div>
            <input
              type="text"
              aria-label="請輸入提問關鍵字"
              placeholder="請輸入提問關鍵字"
              className="text-sm leading-normal w-full bg-black-200 border border-black-600 rounded-md py-1 px-3 focus:bg-black-0 focus:border-primary"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <textarea
              ref={textareaRef}
              name="replyContent"
              id="replyContent"
              aria-label="請輸入回覆內容"
              placeholder="請輸入回覆內容"
              className="text-sm leading-normal w-full h-[84px] bg-black-200 border border-black-600 rounded-md py-1 px-3 focus:bg-black-0 focus:border-primary"
              onInput={handleTextareaInput}
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              style={{ overflow: "scroll" }}
            ></textarea>
            <div className="flex">
              <button
                className="text-xs leading-normal text-black-0 py-1 px-2 rounded-md bg-primary-800 ml-auto outline-none hover:bg-primary focus:outline focus:outline-1 focus:outline-primary focus:outline-offset-0"
                onClick={handleSubmit}
              >
                確認新增
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Backend;
