import { ChatContext, ChatDispatchContext } from "../../chatContext";
import { useContext } from "react";

function ProductCard({ productNumber }) {
  const state = useContext(ChatContext);
  const dispatch = useContext(ChatDispatchContext);

  return (
    <div>
      <div className={`bg-black-0 p-4 rounded-t-lg ${state.showProductInfo ? "flex" : "hidden"} justify-between border-b-1 border-black-400`}>
        <img src={state.productInfo?.image} alt="product-image" className="w-middle h-middle rounded-lg mr-3" />
        <div className="flex flex-col grow justify-between">
          <p className={`text-xs leading-normal flex justify-between`}>
            商品編號 {state.productInfo?.productNumber} <span className={`${productNumber === null ? "inline" : "hidden"} text-primary-800 font-bold `}>推薦</span>
          </p>
          <p className="w-full h-[36px] text-xs leading-normal font-bold line-clamp-2">{state.productInfo?.productName || "商品名稱未找到"}</p>
        </div>
      </div>
      <div className={`bg-black-0 rounded-b-lg  ${state.showProductInfo ? "flex" : "hidden"} justify-center`}>
        <button className="w-full py-2 text-xs leading-normal font-bold text-primary cursor-pointer" onClick={() => dispatch({ type: "TO_PURCHASE" })}>
          立即購買
        </button>
      </div>
    </div>
  );
}
export default ProductCard;
