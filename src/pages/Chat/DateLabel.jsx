import { ChatContext } from "../../chatContextProvider";
import { useContext } from "react";

function DateLabel() {
  const state = useContext(ChatContext);

  {
    return (
      state.scrolling &&
      state.dateLabel && (
        <div className="fixed flex justify-center  top-[70px] left-0 right-0  z-10 ">
          <div className="bg-gray-300/85 rounded-full px-3 py-1 mb-3 shadow-lg">
            <p className="text-xs leading-normal">{state.dateLabel}</p>
          </div>
        </div>
      )
    );
  }
}
export default DateLabel;
