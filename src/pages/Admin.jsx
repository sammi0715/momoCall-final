import { Link } from "react-router-dom";
import { FiChevronLeft, FiPenTool, FiPlus, FiX } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs, updateDoc, addDoc, deleteDoc, doc, orderBy, query } from "../utils/firebase";

function Admin() {
  return (
    <div className="bg-white w-container h-screen my-0 mx-auto px-6 relative font-sans flex flex-col items-center justify-center gap-4">
      <h4 className="font-bold text-xl leading-normal ">管理員登入</h4>
      <input type="text" placeholder="請輸入帳號" className="w-full rounded-lg bg-black-200 py-2 px-4" />
      <input type="password" placeholder="請輸入密碼" className="w-full rounded-lg bg-black-200 py-2 px-4" />
      <input type="button" value="登入" className="w-32 bg-secondary text-white py-2 px-6 rounded-large" />
    </div>
  );
}

export default Admin;
