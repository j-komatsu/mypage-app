import React, { useState, useEffect } from "react";
import Section from "./components/Section";
import "./App.css";
import GoogleIcon from "./assets/google_icon.png";
import { Link } from "react-router-dom";

const MyPage2: React.FC = () => {
  const [pageTitle, setPageTitle] = useState("My Page 2");
  const [isEditingTitle, setEditingTitle] = useState(false);
  const [pageTitles, setPageTitles] = useState({
    mypage3: "My Page 3",
    mypage4: "My Page 4",
    mypage5: "My Page 5",
  });

  useEffect(() => {
    const storedTitle = localStorage.getItem("mypage2_title");
    if (storedTitle) {
      setPageTitle(storedTitle);
    }

    const title3 = localStorage.getItem("mypage3_title") || "My Page 3";
    const title4 = localStorage.getItem("mypage4_title") || "My Page 4";
    const title5 = localStorage.getItem("mypage5_title") || "My Page 5";
    setPageTitles({ mypage3: title3, mypage4: title4, mypage5: title5 });
  }, []);

  const savePageTitle = () => {
    localStorage.setItem("mypage2_title", pageTitle);
    setEditingTitle(false);
  };

  const exportData = () => {
    const data = { ...localStorage };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "mypage_data.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);

        // ローカルストレージにデータを保存
        Object.keys(data).forEach((key) => {
          localStorage.setItem(key, data[key]);
        });

        // 成功通知とリロード
        alert("データのインポートが完了しました！");
        window.location.reload(); // ページの自動リロード
      } catch (error) {
        alert("データのインポートに失敗しました。正しい形式のファイルを選択してください。");
      }
    };
    reader.readAsText(file);

    // 同じファイルを選択してもイベントが発火するようにリセット
    event.target.value = "";
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="title-container">
          {!isEditingTitle ? (
            <>
              <h1 style={{ fontSize: "1.5rem" }}>{pageTitle}</h1>
              <button
                className="edit-title-button"
                onClick={() => setEditingTitle(true)}
              >
                ✎
              </button>
            </>
          ) : (
            <div className="edit-title-container">
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                className="edit-title-input"
              />
              <button className="save-title-button" onClick={savePageTitle}>
                保存
              </button>
            </div>
          )}
        </div>
        <div className="navigation-links">
          <Link to="/" className="navigation-link">
            My Page
          </Link>
          <Link to="/mypage3" className="navigation-link">
            {pageTitles.mypage3}
          </Link>
          <Link to="/mypage4" className="navigation-link">
            {pageTitles.mypage4}
          </Link>
          <Link to="/mypage5" className="navigation-link">
            {pageTitles.mypage5}
          </Link>
          <Link to="/task-manager" className="navigation-link">タスク管理</Link>
          <Link to="/memo-manager" className="navigation-link">メモ帳</Link>
          <a href="https://www.google.com"
            className="navigation-link"
            target="_blank"
            rel="noopener noreferrer">
            Google
          </a>
        </div>
      </header>
      <main className="section-grid">
        {Array.from({ length: 6 }, (_, index) => (
          <Section
            key={index}
            title={`セクション${index + 1}`}
            storageKey={`mypage2_section${index + 1}`}
          />
        ))}
      </main>
      
      <footer className="data-management">
        <div className="data-buttons">
          <button onClick={exportData} className="small-button">エクスポート</button>
          <input
            type="file"
            id="importFile"
            accept=".json"
            style={{ display: "none" }}
            onChange={importData}
          />　
          <button
            className="small-button"
            onClick={() => document.getElementById("importFile")?.click()}
          >
            インポート
          </button>
        </div>
      </footer>
    </div>
  );
};

export default MyPage2;
