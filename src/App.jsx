import { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav.jsx";
import SaveScreen from "./screens/SaveScreen.jsx";
import SearchScreen from "./screens/SearchScreen.jsx";
import { loadBookmarks, saveBookmarks } from "./storage.js";

export default function App() {
  const [activeTab, setActiveTab] = useState("save");
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => setBookmarks(loadBookmarks()), []);

  function addBookmark(bookmark) {
    setBookmarks((current) => {
      const next = [bookmark, ...current];
      saveBookmarks(next);
      return next;
    });
  }

  function updateStatus(id, status) {
    setBookmarks((current) => {
      const next = current.map((item) => item.id === id ? { ...item, status } : item);
      saveBookmarks(next);
      return next;
    });
  }

  return (
    <div className="app-shell">
      {activeTab === "save" && (
        <SaveScreen
          bookmarks={bookmarks}
          onSave={addBookmark}
          onShowBookmarks={() => setActiveTab("search")}
        />
      )}
      {activeTab === "search" && (
        <SearchScreen bookmarks={bookmarks} onUpdateStatus={updateStatus} />
      )}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
