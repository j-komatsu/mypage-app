import React, { useState, useEffect } from "react";
import "./MemoManager.css";
import { Link } from "react-router-dom";

interface Memo {
  id: number;
  title: string;
  content: string;
}

const MemoManager: React.FC = () => {
  const [memos, setMemos] = useState<Memo[]>(() => {
    const storedMemos = localStorage.getItem("memos");
    return storedMemos ? JSON.parse(storedMemos) : [];
  });

  const [newMemoTitle, setNewMemoTitle] = useState("");
  const [newMemoContent, setNewMemoContent] = useState("");
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);

  // メモの保存
  useEffect(() => {
    localStorage.setItem("memos", JSON.stringify(memos));
  }, [memos]);

  const handleAddOrUpdateMemo = () => {
    if (editingMemo) {
      const updatedMemos = memos.map((memo) =>
        memo.id === editingMemo.id
          ? { ...editingMemo, title: newMemoTitle, content: newMemoContent }
          : memo
      );
      setMemos(updatedMemos);
    } else {
      const newMemo: Memo = {
        id: Date.now(),
        title: newMemoTitle,
        content: newMemoContent,
      };
      setMemos([...memos, newMemo]);
    }
    resetForm();
  };

  const handleSelectMemo = (memo: Memo) => {
    setEditingMemo(memo);
    setNewMemoTitle(memo.title);  // 選択時にタイトルを反映
    setNewMemoContent(memo.content);
  };

  const handleDeleteMemo = () => {
    if (editingMemo) {
      setMemos(memos.filter((memo) => memo.id !== editingMemo.id));
      resetForm();
    }
  };

  const resetForm = () => {
    setNewMemoTitle("");
    setNewMemoContent("");
    setEditingMemo(null);
  };

  return (
    <div className="memo-manager">
      <header>
        <button className="back-button">
          <Link to="/" className="back-button-link">MyPageに戻る</Link>
        </button>
      </header>
      <div className="memo-container">
        <div className="memo-list">
          <h2>メモ一覧</h2>
          <ul>
            {memos.map((memo) => (
              <li
                key={memo.id}
                className={editingMemo?.id === memo.id ? "selected-memo" : ""}
                onClick={() => handleSelectMemo(memo)}
              >
                <strong>{memo.title}</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="memo-editor">

          <label>タイトル</label>
          <input
            type="text"
            value={newMemoTitle}
            onChange={(e) => setNewMemoTitle(e.target.value)}
          />
          <label>内容</label>
          <textarea
            rows={24}
            value={newMemoContent}
            onChange={(e) => setNewMemoContent(e.target.value)}
          />
          <div className="button-group">
            <button className="save-button" onClick={handleAddOrUpdateMemo}>
              {editingMemo ? "保存" : "メモを追加"}
            </button>
            <button className="delete-button" onClick={handleDeleteMemo}>
              メモを削除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoManager;
