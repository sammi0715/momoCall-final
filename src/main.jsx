import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { StrictMode } from "react";
import App from "./App.jsx";
import ProductChat from "./pages/ProductChat";
import SearchPages from "./pages/Search.jsx";
import Finish from "./pages/Finish.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="productChat" element={<ProductChat />} />
          <Route path="searchPage" element={<SearchPages />} />
          <Route path="finishPage" element={<Finish />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
