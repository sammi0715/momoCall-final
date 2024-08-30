import PropTypes from "prop-types";
import { createContext, useReducer } from "react";

export const ChatContext = createContext(null);
export const ChatDispatchContext = createContext(null);

const initialState = {
  messages: [],
  inputValue: "",
  showOrderInfo: false,
  showShopInfo: false,
  showProductInfo: false,
  isGPTLoading: false,
  isImageLoading: false,
  isChoose: false,
  isPurchase: false,
  isCheckout: false,
  count: 0,
  spec: "",
  divHeightClass: "h-screen",
  productInfo: null,
  shopName: "",
  orderInfo: null,
  errorMsg: "",
  dateLabel: "",
  scrolling: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "SET_INPUT_VALUE":
      return { ...state, inputValue: action.payload };
    case "TOGGLE_ORDER_INFO":
      return { ...state, showOrderInfo: action.payload };
    case "TOGGLE_SHOP_INFO":
      return { ...state, showShopInfo: action.payload };
    case "TOGGLE_PRODUCT_INFO":
      return { ...state, showProductInfo: action.payload };
    case "TOGGLE_USEFUL": {
      let copyMessages = state.messages.map((item, index) => {
        if (index == action.payload.index) return { ...item, isUseful: action.payload.isUseful };
        return item;
      });
      return { ...state, messages: copyMessages };
    }
    case "RESET_INPUT_VALUE":
      return { ...state, inputValue: "" };
    case "TOGGLE_GPT_LOADING":
      return { ...state, isGPTLoading: !state.isGPTLoading };
    case "TOGGLE_IMG_LOADING":
      return { ...state, isImageLoading: !state.isImageLoading };
    case "TO_PURCHASE":
      return { ...state, isChoose: !state.isChoose };
    case "TO_CHECKOUT":
      if (state.count === 0) {
        alert("請選擇數量");
        return state;
      }
      return { ...state, isPerchase: !state.isPerchase };
    case "FINISH_CHECKOUT":
      if (state.isCheckout == true) window.location.reload();
      return {
        ...state,
        isCheckout: !state.isCheckout,
        isChoose: false,
        isPerchase: false,
        count: 0,
      };
    case "ADD_PRODUCT_NUM":
      return { ...state, count: state.count + 1 };
    case "SUB_PRODUCT_NUM":
      if (state.count === 0) return state;
      return { ...state, count: state.count - 1 };
    case "SELECT_SPEC":
      return { ...state, spec: action.payload };
    case "SET_DIV_HEIGHT":
      return {
        ...state,
        divHeightClass: action.payload,
      };
    case "SET_PRODUCT_INFO":
      return { ...state, productInfo: action.payload };
    case "SET_SHOP_NAME":
      return { ...state, shopName: action.payload };
    case "SET_ORDER_INFO":
      return { ...state, orderInfo: action.payload };
    case "SET_GPT_ERROR":
      return { ...state, errorMsg: action.payload };
    case "SET_DATE_LABEL":
      return { ...state, dateLabel: action.payload };
    case "SET_IS_SCROLLING":
      return { ...state, scrolling: action.payload };
    default:
      return state;
  }
}

export function ChatContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ChatContext.Provider value={state}>
      <ChatDispatchContext.Provider value={dispatch}>{children}</ChatDispatchContext.Provider>
    </ChatContext.Provider>
  );
}

ChatContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
