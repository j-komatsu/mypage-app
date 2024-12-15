import React, { useState, useEffect } from "react";
import "./Section.css";

interface Link {
  id: number;
  title: string;
  url: string;
}

interface SectionProps {
  title: string;
  storageKey: string;
}

const Section: React.FC<SectionProps> = ({ title, storageKey }) => {
  const [isEditPopupVisible, setEditPopupVisible] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const [links, setLinks] = useState<Link[]>([]);
  const [sectionTitle, setSectionTitle] = useState(title);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isDeletePopupVisible, setDeletePopupVisible] = useState(false);
  const [isTitleEditPopupVisible, setTitleEditPopupVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState(sectionTitle);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // ローカルストレージからデータを読み込む
  useEffect(() => {
    const storedLinks = localStorage.getItem(storageKey);
    if (storedLinks) {
      setLinks(JSON.parse(storedLinks));
    }

    const storedTitle = localStorage.getItem(`${storageKey}_title`);
    if (storedTitle) {
      setSectionTitle(storedTitle);
    }
  }, [storageKey]);

  // ローカルストレージにデータを保存する
  const saveToLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addLink = () => {
    if (newTitle && newUrl) {
      const updatedLinks = [
        ...links,
        { id: Date.now(), title: newTitle, url: newUrl },
      ];
      setLinks(updatedLinks);
      saveToLocalStorage(storageKey, updatedLinks);
      setNewTitle("");
      setNewUrl("");
      setPopupVisible(false);
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteTargetId(id);
    setDeletePopupVisible(true);
  };


  const [editTargetId, setEditTargetId] = useState<number | null>(null);




  const openEditPopup = (id: number, title: string, url: string) => {
    //alert(`openEditPopup called with: id=${id}, title=${title}, url=${url}`);
    setEditTargetId(id);
    setEditTitle(title);
    setEditUrl(url);
    setEditPopupVisible(true);
  };

  const saveEditedLink = () => {
    if (editTargetId !== null && editTitle && editUrl) {
      const updatedLinks = links.map((link) =>
        link.id === editTargetId ? { ...link, title: editTitle, url: editUrl } : link
      );
      setLinks(updatedLinks);
      saveToLocalStorage(storageKey, updatedLinks);
      setEditPopupVisible(false);
      setEditTargetId(null);
    }
  };

  const deleteLink = () => {

    if (deleteTargetId !== null) {
      const updatedLinks = links.filter((link) => link.id !== deleteTargetId);
      setLinks(updatedLinks);
      saveToLocalStorage(storageKey, updatedLinks);
      setDeletePopupVisible(false);
      setDeleteTargetId(null);
    }
  };

  const saveSectionTitle = () => {
    setSectionTitle(newSectionTitle);
    localStorage.setItem(`${storageKey}_title`, newSectionTitle);
    setTitleEditPopupVisible(false);
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>{sectionTitle}</h2>
        <div className="section-buttons">
          <button
            className="edit-title-button"
            onClick={() => setTitleEditPopupVisible(true)}
          >
            ✎
          </button>
          {links.length < 5 && (
            <button
              className="add-link-button"
              onClick={() => setPopupVisible(true)}
            >
              +
            </button>
          )}
        </div>
      </div>
      <ul className={`link-list link-list-${Math.min(links.length, 5)}`}>
        {links.map((link) => (
          <li key={link.id}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.title}
            </a>

            <button className="edit-link-button" onClick={() => openEditPopup(link.id, link.title, link.url)}>
              ✎
            </button>
            <button onClick={() => confirmDelete(link.id)}>-</button>

          </li>
        ))}
      </ul>
      {isEditPopupVisible && (
        <div className="popup">
          <h3>リンクを編集</h3>
          <input
            type="text"
            placeholder="タイトル"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <input
            type="url"
            placeholder="URL"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
          />
          <div className="popup-buttons">
          <button className="add" onClick={saveEditedLink}>
  保存
</button>
            <button className="cancel" onClick={() => setEditPopupVisible(false)}>
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* リンク追加用ポップアップ */}
      {isPopupVisible && (
        <div className="popup">
          <h3>リンクを追加</h3>
          <input
            type="text"
            placeholder="タイトル"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            type="url"
            placeholder="URL"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <div className="popup-buttons">
            <button className="add" onClick={addLink}>
              追加
            </button>
            <button className="cancel" onClick={() => setPopupVisible(false)}>
              キャンセル
            </button>
          </div>
        </div>
      )}
      {/* セクションタイトル編集ポップアップ */}
      {isTitleEditPopupVisible && (
        <div className="popup">
          <h3>セクションタイトルを編集</h3>
          <input
            type="text"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
          />
          <div className="popup-buttons">
            <button className="add" onClick={saveSectionTitle}>
              保存
            </button>
            <button
              className="cancel"
              onClick={() => setTitleEditPopupVisible(false)}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
      {/* リンク削除確認用ポップアップ */}
      {isDeletePopupVisible && (
        <div className="popup">
          <h3>リンクを削除しますか？</h3>
          <div className="popup-buttons">
            <button className="delete" onClick={deleteLink}>
              削除
            </button>
            <button
              className="cancel"
              onClick={() => setDeletePopupVisible(false)}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section;
