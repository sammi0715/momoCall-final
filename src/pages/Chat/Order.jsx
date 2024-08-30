import { ChatContext, ChatDispatchContext } from "../../chatContextProvider";
import { useContext } from "react";

function Order() {
  const state = useContext(ChatContext);
  const { dispatch } = useContext(ChatDispatchContext);

  return (
    <div className={`${state.isCheckout ? "flex" : "hidden"} justify-center items-center w-container h-full fixed top-0 bg-black-800/80`}>
      <div className="w-64 h-32 bg-white mx-auto py-2 px-4 flex flex-col gap-3 text-sm rounded-xl">
        <h4 className="text-center font-bold leading-normal text-lg text-primary-800 mt-2">付款成功，即將為您出貨</h4>
        <p className="text-center font-bold">訂單編號：20240827000001</p>

        <button onClick={() => dispatch({ type: "FINISH_CHECKOUT" })} className="block w-full h-8 text-primary-800 font-bold ">
          確認
        </button>
      </div>
    </div>
  );
}
export default Order;
