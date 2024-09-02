import { useNavigate } from "react-router-dom";
import { useEffect, useReducer } from "react";
import { db, collection, where, getDocs, updateDoc, doc, query } from "../utils/firebase";

const initialState = {
  account: "",
  password: "",
  isLoging: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ACCOUNT":
      return { ...state, account: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "LOGIN_STATE":
      return { ...state, isLoging: action.payload };
    default:
      return state;
  }
}

function Admin() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/console");
    }
  }, []);

  const searchAdmin = async () => {
    const queryAccount = query(collection(db, "admin"), where("account", "==", state.account));

    const accountSnapshot = await getDocs(queryAccount);
    console.log(accountSnapshot.docs[0].id);

    if (accountSnapshot.docs.length > 0) {
      const user = accountSnapshot.docs[0].data();

      if (state.password === user.password) {
        await updateDoc(doc(db, "admin", accountSnapshot.docs[0].id), { isLogin: true });

        localStorage.setItem(`user`, JSON.stringify({ account: user.account, login: user.isLogin }));
        navigate("/console");
      } else {
        dispatch({ type: "LOGIN_STATE", payload: "Password error" });
      }
    } else {
      dispatch({ type: "LOGIN_STATE", payload: "Account not found" });
    }
  };

  return (
    <div className="bg-white w-container h-screen my-0 mx-auto px-6 relative font-sans flex flex-col items-center justify-center gap-4">
      <h4 className="font-bold text-xl leading-normal ">管理員登入</h4>
      <input
        type="text"
        placeholder="請輸入帳號"
        className={`w-full rounded-lg bg-black-200 py-2 px-4 ${state.isLoging === "" ? "" : state.isLoging === "Account not found" ? "outline-red-700 outline-2 outline-none" : ""}`}
        onChange={(e) => dispatch({ type: "SET_ACCOUNT", payload: e.target.value })}
      />
      <input
        type="password"
        placeholder="請輸入密碼"
        className={`w-full rounded-lg bg-black-200 py-2 px-4 ${state.isLoging === "" ? "" : state.isLoging === "Password error" ? "outline-red-700 outline-2 outline-none" : ""}`}
        onChange={(e) => dispatch({ type: "SET_PASSWORD", payload: e.target.value })}
      />

      <input type="button" value="登入" className="w-32 bg-secondary text-white py-2 px-6 rounded-large" onClick={searchAdmin} />
      <p className={`text-sm -my-2 text-left ${state.isLoging !== "" ? "block" : "hidden"}`}>{state.isLoging}</p>
    </div>
  );
}

export default Admin;
