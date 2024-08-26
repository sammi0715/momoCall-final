import { FiChevronLeft } from "react-icons/fi";
import momoLogo from "/momocallLogo.png";
import { useEffect, useReducer, useState } from "react";
import db from "../utils/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { Link } from "react-router-dom";

const initialState = {
  searchTerm: "",
  results: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_RESULTS":
      return { ...state, results: action.payload };
    default:
      return state;
  }
};

const SearchPages = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [latestMessages, setLatestMessages] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (state.searchTerm) {
        const fetchedResults = await searchFirestore(state.searchTerm);
        dispatch({ type: "SET_RESULTS", payload: fetchedResults });
      } else {
        dispatch({ type: "SET_RESULTS", payload: [] });
      }
    };

    fetchData();
  }, [state.searchTerm]);

  useEffect(() => {
    const fetchLatestMessages = async () => {
      const updatedMessages = {};
      for (const result of state.results) {
        if (result.collectionName === "chatroom") {
          const messagesRef = collection(db, `chatroom/${result.id}/messages`);
          const messagesQuery = query(
            messagesRef,
            orderBy("created_time", "desc"),
            limit(1)
          );
          const messagesSnapshot = await getDocs(messagesQuery);
          if (!messagesSnapshot.empty) {
            const latestMessage = messagesSnapshot.docs[0].data();
            updatedMessages[result.id] = latestMessage;
          }
        }
      }
      setLatestMessages(updatedMessages);
    };

    fetchLatestMessages();
  }, [state.results]);

  const handleInputChange = (event) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: event.target.value });
  };

  return (
    <div className="w-container max-w-screen min-h-screen m-[auto] bg-white justify-center p-3 pt-0 font-sans">
      <header className="flex items-center py-4">
        <button className="mr-3">
          <FiChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl leading-normal font-bold text-primary ml-20">
          momoCall
        </h1>
      </header>
      <input
        type="text"
        placeholder="請輸入商店名稱、商品名稱或商品編號"
        className="leading-normal w-full h-8 text-sm text-black-100 text-center bg-black-400 placeholder-black rounded-full mb-4 hover:bg-black-200 focus:outline outline-black-600 focus:bg-black-200"
        value={state.searchTerm}
        onChange={handleInputChange}
      />
      <div>
        {state.results
          .filter((result) => result.collectionName === "chatroom")
          .map((result, index) => (
            <Link
              to={"/chat"}
              key={result.id}
              className={`w-full py-4 flex items-center border-t border-gray-300 cursor-pointer ${
                index === state.results.length - 1
                  ? "border-b border-gray-300"
                  : ""
              }`}
            >
              <img
                className="w-large h-large rounded-full"
                src={momoLogo}
              ></img>

              <div className="flex ml-4 flex-col py-2 justify-between w-full h-large">
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-bold text-primary leading-normal w-messageContent h-6">
                    {result.shopName}
                  </h2>
                  <p className="text-xs text-gray-500 leading-normal">
                    {latestMessages[result.id]?.created_time
                      ? new Date(
                          latestMessages[result.id].created_time.seconds * 1000
                        ).toLocaleDateString("zh-TW", {
                          month: "2-digit",
                          day: "2-digit",
                        })
                      : " "}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 leading-normal w-messageContent h-6 overflow-hidden text-ellipsis">
                    {latestMessages[result.id]?.content || ""}
                  </p>
                  {latestMessages[result.id] && result.unreadCount > 0 && (
                    <div className="bg-primary-800 text-black-0 text-base w-6 h-6 rounded-full flex items-center justify-center ml-2">
                      {result.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default SearchPages;

const searchFirestore = async (searchTerm) => {
  let results = [];

  // 搜尋 chatroom 集合中的 shopName
  const chatroomQuery = query(
    collection(db, "chatroom"),
    where("shopName", "==", searchTerm)
  );
  const chatroomSnapshot = await getDocs(chatroomQuery);
  for (const doc of chatroomSnapshot.docs) {
    let data = { id: doc.id, ...doc.data(), collectionName: "chatroom" };
    results.push(data);
    console.log(results);
  }

  // 搜尋 orders 集合中的 orderName
  const ordersQuery = query(
    collection(db, "orders"),
    where("orderNumber", "==", searchTerm)
  );
  const ordersSnapshot = await getDocs(ordersQuery);
  for (const doc of ordersSnapshot.docs) {
    const orderData = doc.data();
    const shopId = orderData.shopId;

    // 根據 shopId 搜尋 chatroom
    const chatroomByShopIdQuery = query(
      collection(db, "chatroom"),
      where("shopId", "==", shopId)
    );
    const chatroomByShopIdSnapshot = await getDocs(chatroomByShopIdQuery);
    for (const chatroomDoc of chatroomByShopIdSnapshot.docs) {
      let data = {
        id: chatroomDoc.id,
        ...chatroomDoc.data(),
        collectionName: "chatroom",
      };
      results.push(data);
      console.log(results);
    }
  }

  // 搜尋 shops 集合中的 products 集合
  const shopsSnapshot = await getDocs(collection(db, "shops"));
  for (const shopDoc of shopsSnapshot.docs) {
    const shopIdentifier = shopDoc.id;
    const productsRef = collection(db, `shops/${shopIdentifier}/products`);
    const productsQuery = query(
      productsRef,
      where("productName", "==", searchTerm)
    );
    const productsSnapshot = await getDocs(productsQuery);

    if (!productsSnapshot.empty) {
      // 根據 shopId 搜尋 chatroom
      const shopData = shopDoc.data();
      const shopId = shopData.shopId; // 自定義的 shopId
      const chatroomByShopIdQuery = query(
        collection(db, "chatroom"),
        where("shopId", "==", shopId)
      );
      const chatroomByShopIdSnapshot = await getDocs(chatroomByShopIdQuery);
      for (const chatroomDoc of chatroomByShopIdSnapshot.docs) {
        let data = {
          id: chatroomDoc.id,
          ...chatroomDoc.data(),
          collectionName: "chatroom",
        };
        results.push(data);
        console.log(results);
      }
    }
  }

  return results;
};
