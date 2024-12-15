import React, { useState, useEffect } from "react";
import Section from "./components/Section";
import "./App.css";
import { Link } from "react-router-dom";
import GoogleIcon from "./assets/google_icon.png"; // アイコン画像のインポート

const App = () => {
  const [sections, setSections] = useState<string[]>([]);

  // 初期化時にローカルストレージからセクションデータを取得
  useEffect(() => {
    const storedSections = JSON.parse(localStorage.getItem("sections") || "[]");
    if (storedSections.length === 0) {
      const defaultSections = ["セクション1", "セクション2", "セクション3", "セクション4", "セクション5", "セクション6"];
      setSections(defaultSections);
      localStorage.setItem("sections", JSON.stringify(defaultSections));
    } else {
      setSections(storedSections);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sections", JSON.stringify(sections));
  }, [sections]);

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
        <h1>My Page</h1>
        <div className="navigation-links">
          <Link to="/mypage2" className="navigation-link">My Page 2</Link>
          <Link to="/mypage3" className="navigation-link">My Page 3</Link>
          <Link to="/mypage4" className="navigation-link">My Page 4</Link>
          <Link to="/mypage5" className="navigation-link">My Page 5</Link>
          <Link to="/task-manager" className="navigation-link">タスク管理</Link>
          <Link to="/memo-manager" className="navigation-link">メモ帳</Link>
        </div>
        {/* Google ボタンの追加 */}
        <button
          className="google-button"
          onClick={() => window.open("https://www.google.com", "_blank")}
        >
          <img
            src={GoogleIcon}  // アイコンの画像パス
            alt="Google Icon"
            className="google-icon"
          />
        </button>
      </header>
      <main className="section-grid">
        {sections.map((title, index) => (
          <Section
            key={index}
            title={title}
            storageKey={`section_${index}`}
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

export default App;
