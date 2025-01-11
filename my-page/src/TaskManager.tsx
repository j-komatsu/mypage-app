import React, { useState, useEffect } from "react";
import "./TaskManager.css";
import { Link } from "react-router-dom";

interface Task {
  id: number;
  title: string;  // タイトルプロパティを追加
  content: string;
  startDate: string;
  endDate: string;
  category: string;
  status: string;
  priority: string;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>(["仕事", "プライベート", "その他"]);
  const [newTaskTitle, setNewTaskTitle] = useState("");  // タイトル用の状態
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskStartDate, setNewTaskStartDate] = useState("");
  const [newTaskEndDate, setNewTaskEndDate] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("仕事");
  const [newTaskStatus, setNewTaskStatus] = useState("未着手");
  const [newTaskPriority, setNewTaskPriority] = useState("中");
  const [showPopup, setShowPopup] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterKey, setFilterKey] = useState({
    category: "",
    status: "",
    priority: "",
    startDate: "",
    endDate: "",
  });
  const [sortKey, setSortKey] = useState<keyof Task>("startDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");


  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);

  const saveTasksToLocalStorage = (tasks: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const addTask = () => {
    if (newTaskTitle && newTaskContent && newTaskStartDate && newTaskEndDate) {
      const newTask: Task = {
        id: Date.now(),
        title: newTaskTitle,  // タイトル追加
        content: newTaskContent,
        startDate: newTaskStartDate,
        endDate: newTaskEndDate,
        category: newTaskCategory,
        status: newTaskStatus,
        priority: newTaskPriority,
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      resetForm();
      setShowPopup(false);
    }
  };


  const editTask = () => {
    if (editingTask) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask.id
          ? {
            ...task,
            title: newTaskTitle,  // タイトル追加
            content: newTaskContent,
            startDate: newTaskStartDate,
            endDate: newTaskEndDate,
            category: newTaskCategory,
            status: newTaskStatus,
            priority: newTaskPriority,
          }
          : task
      );
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      setEditingTask(null);
      setShowPopup(false);
    }
  };

  // タスク削除関数
  const handleDeleteTask = (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);  // ローカルストレージに保存
  };

  const resetForm = () => {
    setNewTaskContent("");
    setNewTaskStartDate("");
    setNewTaskEndDate("");
    setNewTaskCategory("仕事");
    setNewTaskStatus("未着手");
    setNewTaskPriority("中");
  };

  const openAddTaskPopup = () => {
    resetForm();
    setEditingTask(null);
    setShowPopup(true);
  };

  const openEditTaskPopup = (task: Task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);  // タイトル読み込み
    setNewTaskContent(task.content);
    setNewTaskStartDate(task.startDate);
    setNewTaskEndDate(task.endDate);
    setNewTaskCategory(task.category);
    setNewTaskStatus(task.status);
    setNewTaskPriority(task.priority);
    setShowPopup(true);
  };

  const applyFilters = (tasks: Task[]) => {
    return tasks.filter((task) => {
      if (task.status === "完了" && !filterKey.status) return false;

      if (filterKey.category && task.category !== filterKey.category) return false;
      if (filterKey.status && task.status !== filterKey.status) return false;
      if (filterKey.priority && task.priority !== filterKey.priority) return false;

      if (filterKey.startDate && !filterKey.endDate) {
        if (task.startDate < filterKey.startDate) return false;
      } else if (!filterKey.startDate && filterKey.endDate) {
        if (task.endDate > filterKey.endDate) return false;
      } else if (filterKey.startDate && filterKey.endDate) {
        if (
          task.startDate > filterKey.endDate ||
          task.endDate < filterKey.startDate
        )
          return false;
      }

      return true;
    });
  };

  const toggleSortOrder = (key: keyof Task) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const getAlertClass = (endDate: string) => {
    const currentDate = new Date();
    const end = new Date(endDate);
    const diffDays = Math.ceil((end.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return "alert-overdue";
    } else if (diffDays <= 3) {
      return "alert-near";
    }
    return "";
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const aValue = a[sortKey] || "";
    const bValue = b[sortKey] || "";
    const comparison = String(aValue).localeCompare(String(bValue));
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const filteredTasks = applyFilters(sortedTasks);

  return (
    <div className="task-manager">
      <header>
        <button className="back-button">
          <Link to="/" className="back-button-link">MyPageに戻る</Link>
        </button>
        <h1>タスク管理</h1>
      </header>
      <button className="add-task-button" onClick={openAddTaskPopup}>
        タスクを追加
      </button>
      <div className="filters">
        {/* フィルター */}
        <select
          value={filterKey.category}
          onChange={(e) => setFilterKey({ ...filterKey, category: e.target.value })}
        >
          <option value="">カテゴリで絞り込み</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={filterKey.status}
          onChange={(e) => setFilterKey({ ...filterKey, status: e.target.value })}
        >
          <option value="">ステータスで絞り込み</option>
          <option value="未着手">未着手</option>
          <option value="進行中">進行中</option>
          <option value="確認中">確認中</option>
          <option value="完了">完了</option>
          <option value="中止">中止</option>
        </select>
        <select
          value={filterKey.priority}
          onChange={(e) => setFilterKey({ ...filterKey, priority: e.target.value })}
        >
          <option value="">優先度で絞り込み</option>
          <option value="低">低</option>
          <option value="中">中</option>
          <option value="高">高</option>
          <option value="最高">最高</option>
        </select>
        {/* <input
          type="date"
          value={filterKey.startDate}
          onChange={(e) => setFilterKey({ ...filterKey, startDate: e.target.value })}
        />
        <input
          type="date"
          value={filterKey.endDate}
          onChange={(e) => setFilterKey({ ...filterKey, endDate: e.target.value })}
        /> */}
      </div>
      <div className="task-list-container">
        <table className="task-table">
          <thead>
            <tr>
              <th onClick={() => toggleSortOrder("title")}>タイトル</th> {/* タイトル列 */}
              <th onClick={() => toggleSortOrder("startDate")}>開始日</th>
              <th onClick={() => toggleSortOrder("endDate")}>終了日</th>
              <th onClick={() => toggleSortOrder("category")}>カテゴリ</th>
              <th onClick={() => toggleSortOrder("status")}>ステータス</th>
              <th onClick={() => toggleSortOrder("priority")}>優先度</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className={getAlertClass(task.endDate)}>
                <td>{task.title}</td> {/* タイトルを表示 */}
                <td>{task.startDate}</td>
                <td>{task.endDate}</td>
                <td>{task.category}</td>
                <td>{task.status}</td>
                <td>{task.priority}</td>
                <td>
                  <button onClick={() => openEditTaskPopup(task)}>編集</button>
                  <button
                    className="delete-task-button"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPopup && (
        <div className="popup">
          <h2>{editingTask ? "タスクを編集" : "タスクを追加"}</h2>
          <label>タイトル</label>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <label>内容</label>
          <textarea
            rows={6}  // 表示行数を指定
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
          />
          <label>開始日</label>
          <input
            type="date"
            value={newTaskStartDate}
            onChange={(e) => setNewTaskStartDate(e.target.value)}
          />
          <label>終了日</label>
          <input
            type="date"
            value={newTaskEndDate}
            onChange={(e) => setNewTaskEndDate(e.target.value)}
          />
          <label>カテゴリ</label>
          <select
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(e.target.value)}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <label>ステータス</label>
          <select
            value={newTaskStatus}
            onChange={(e) => setNewTaskStatus(e.target.value)}
          >
            <option value="未着手">未着手</option>
            <option value="進行中">進行中</option>
            <option value="確認中">確認中</option>
            <option value="完了">完了</option>
            <option value="中止">中止</option>
          </select>
          <label>優先度</label>
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
          >
            <option value="低">低</option>
            <option value="中">中</option>
            <option value="高">高</option>
            <option value="最高">最高</option>
          </select>
          <div className="popup-buttons">
            <button onClick={editingTask ? editTask : addTask}>
              {editingTask ? "保存" : "登録"}
            </button>
            <button onClick={() => setShowPopup(false)}>キャンセル</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
