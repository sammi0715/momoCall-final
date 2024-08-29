import { ChatContext, ChatDispatchContext } from "../../chatContext";
import { useContext } from "react";
import { AiOutlineLike, AiOutlineDislike, AiFillDislike, AiFillLike } from "react-icons/ai";
import happy from "./img/happy.png";
import { marked } from "marked";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

function MessageBox() {
  const state = useContext(ChatContext);
  const dispatch = useContext(ChatDispatchContext);
  {
    state.messages.map((message, index) => {
      return (
        <div key={index} id={`message-${index}`}>
          <div key={index} className={`group flex gap-1 mr-3 relative ${message.from === "user1" ? "items-end flex-col" : "max-w-[258px] flex-wrap"}`}>
            {message.from !== "user1" && <img src={happy} alt="" className="w-9 h-9" />}
            <div
              className={` w-fit max-w-52 text-black break-words rounded-lg p-3 relative ${message.from === "user1" ? "bg-white" : "bg-primary-600"} ${message.from === "user1" ? "" : "ml-2"} ${
                message.from === "user1"
                  ? "after:absolute after:top-4 after:-right-3 after:content-[''] after:w-0 after:h-0 after:block after:border-b-[20px] after:border-l-[20px] after:border-l-white after:border-b-transparent"
                  : "after:absolute after:top-4 after:-left-3 after:content-[''] after:w-0 after:h-0 after:block after:border-b-[20px] after:border-r-[20px] after:border-r-primary-600 after:border-b-transparent"
              }`}
            >
              {imageFormats.some((format) => message.content.includes(format)) ? (
                <PhotoProvider maskOpacity={0.5}>
                  <PhotoView src={message.content}>
                    <img src={message.content} alt="Sent" className="rounded-lg max-w-full h-auto" />
                  </PhotoView>
                </PhotoProvider>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: marked(message.content) }}></p>
              )}
            </div>

            <small className={`${message.from === "user1" ? "" : "ml-12 "} h-6`}>{message.created_time?.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "Loading..."}</small>
            <div className="hidden group-hover:block ">
              <button
                onClick={() => dispatch({ type: "TOGGLE_USEFUL", payload: { index, isUseful: "Yes" } })}
                className={`${message.from === "user1" ? "hidden" : state.messages[index].isUseful === "No" ? "hidden" : "inline"} mx-2`}
              >
                <AiOutlineLike className={`${state.messages[index].isUseful === "Yes" ? "hidden" : "inline"}`} />
                <AiFillLike className={`${state.messages[index].isUseful == "Yes" ? "inline" : "hidden"}`} />
              </button>
              <button
                onClick={() => dispatch({ type: "TOGGLE_USEFUL", payload: { index, isUseful: "No" } })}
                className={`${message.from === "user1" ? "hidden" : state.messages[index].isUseful === "Yes" ? "hidden" : "inline"} mx-2`}
              >
                <AiOutlineDislike className={`${state.messages[index].isUseful === "No" ? "hidden" : "inline"}`} />
                <AiFillDislike className={`${state.messages[index].isUseful == "No" ? "inline" : "hidden"}`} />
              </button>
            </div>
          </div>
        </div>
      );
    });
  }
}
export default MessageBox;
