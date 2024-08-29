import { Link } from "react-router-dom";
import { FiChevronLeft, FiPenTool, FiPlus, FiX } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs, updateDoc, addDoc, deleteDoc, doc } from "../utils/firebase";

function Backend() {
  const [openId, setOpenId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [currentFaqId, setCurrentFaqId] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "faq"));
      if (!querySnapshot.empty) {
        const faqList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          keyword: doc.data().keyword,
          response: doc.data().response,
        }));
        setFaqs(faqList);
      } else {
        console.log("No data");
      }
    };
    fetchData();
  }, []);

  const toggleCollapse = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const handleTextareaInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const toggleModal = (input = "", textarea = "", editMode = false) => {
    setInputValue(input);
    setTextareaValue(textarea);
    setIsEditMode(editMode);
    setIsModalOpen(!isModalOpen);
  };

  const addFaq = async (keyword, response) => {
    try {
      const docRef = await addDoc(collection(db, "faq"), { keyword, response });
      console.log("Document written with ID: ", docRef.id);
      setFaqs([...faqs, { id: docRef.id, keyword, response }]);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const updateFaq = async (id, keyword, response) => {
    try {
      const faqDoc = doc(db, "faq", id);
      await updateDoc(faqDoc, { keyword, response });
      console.log("Document updated with ID: ", id);
      setFaqs(faqs.map((faq) => (faq.id === id ? { id, keyword, response } : faq)));
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const deleteFaq = async (id) => {
    try {
      const faqDoc = doc(db, "faq", id);
      await deleteDoc(faqDoc);
      console.log("Document deleted with ID: ", id);
      setFaqs(faqs.filter((faq) => faq.id !== id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const handleSubmit = () => {
    if (inputValue && textareaValue) {
      if (isEditMode) {
        updateFaq(currentFaqId, inputValue, textareaValue);
      } else {
        addFaq(inputValue, textareaValue);
      }
      setInputValue("");
      setTextareaValue("");
      setIsEditMode(false);
      setCurrentFaqId(null);
      setIsModalOpen(false);
    } else {
      alert("請填寫所有欄位");
    }
  };

  const handleEdit = (id, keyword, response) => {
    setInputValue(keyword);
    setTextareaValue(response);
    setIsEditMode(true);
    setCurrentFaqId(id);
    setIsModalOpen(true);
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
          {faqs.map((faq, index) => (
            <div key={faq.id}>
              <div className="bg-primary-600 rounded-lg py-2 px-4 flex justify-between items-center cursor-pointer" onClick={() => toggleCollapse(index)}>
                <p className="text-black text-base leading-normal">{faq.keyword}</p>
                <button className="cursor-pointer" onClick={() => handleEdit(faq.id, faq.keyword, faq.response)}>
                  <FiPenTool className="w-6 h-6 hover:text-primary" />
                </button>
              </div>
              <div className={`bg-black-0 rounded-lg px-4 transition-max-height duration-300 ease-in overflow-hidden ${openId === index ? "max-h-screen py-2 mt-2" : "max-h-0"}`}>
                <p className="text-black text-base leading-normal">{faq.response}</p>
              </div>
            </div>
          ))}
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
              <p className="text-base leading-normal">{isEditMode ? "修改問答" : "新增問答"}</p>
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
            <div className="flex gap-1">
              <button
                className={`text-xs leading-normal text-black-0 py-1 px-2 rounded-md bg-primary ml-auto outline-none hover:bg-primary focus:outline focus:outline-1 focus:outline-primary focus:outline-offset-0 ${
                  isEditMode ? "block" : "hidden"
                }`}
                onClick={() => deleteFaq(currentFaqId)}
              >
                {isEditMode ? "刪除問答" : ""}
              </button>
              <button
                className={`text-xs leading-normal text-black-0 py-1 px-2 rounded-md bg-primary-800 outline-none hover:bg-primary focus:outline focus:outline-1 focus:outline-primary focus:outline-offset-0 ${
                  isEditMode ? "" : "ml-auto"
                }`}
                onClick={handleSubmit}
              >
                {isEditMode ? "確認修改" : "確認新增"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Backend;
