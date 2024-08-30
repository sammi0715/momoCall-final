import { ChatContext } from "../../chatContextProvider";
import { useContext } from "react";

function OrderCard() {
  const state = useContext(ChatContext);
  return (
    <div className={`${state.showOrderInfo ? "grid" : "hidden"} bg-black-0 w-container py-2 px-3 grid-cols-4 gap-6 top-[68px] mt-[68px] left-0 right-0 z-10 my-0 mx-auto`}>
      <div className="flex flex-col items-center gap-y-2 col-span-1">
        <img
          src="https://images.unsplash.com/photo-1635865933730-e5817b5680cd?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="product-image"
          className="rounded-full w-large h-large"
        />
        <p className="text-xs leading-normal text-center w-large bg-secondary-400 text-secondary rounded-lg">{state.orderInfo?.status}</p>
      </div>
      <div className="flex flex-col gap-y-1 col-span-3">
        <p className="font-bold">{state.orderInfo?.shopName || "商家名稱未找到"}</p>
        <p className="text-primary">NT. {state.orderInfo?.totalPrice}</p>
        <p>訂單編號：{state.orderInfo?.orderNumber}</p>
      </div>
    </div>
  );
}
export default OrderCard;
