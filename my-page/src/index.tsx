import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import MyPage2 from "./MyPage2";
import MyPage3 from "./MyPage3";
import MyPage4 from "./MyPage4";
import MyPage5 from "./MyPage5";
import TaskManager from "./TaskManager"; // タスク管理ページのインポート
import MemoManager from "./MemoManager"; // タスク管理ページのインポート

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/mypage2" element={<MyPage2 />} />
        <Route path="/mypage3" element={<MyPage3 />} />
        <Route path="/mypage4" element={<MyPage4 />} />
        <Route path="/mypage5" element={<MyPage5 />} />
        <Route path="/task-manager" element={<TaskManager />} /> {/* タスク管理ページ */}
        <Route path="/memo-manager" element={<MemoManager />} /> {/* メモ帳ページ */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
