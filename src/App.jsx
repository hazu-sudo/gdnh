import { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav";
import HomeScreen from "./screens/HomeScreen";
import OpenScreen from "./screens/OpenScreen";
import PendingScreen from "./screens/PendingScreen";
import SaveScreen from "./screens/SaveScreen";
import SearchScreen from "./screens/SearchScreen";
import { loadBookmarks, saveBookmarks } from "./storage";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => setBookmarks(loadBookmarks()), []);

  function saveBookmark(bookmark) {
    const next = [bookmark, ...bookmarks];
    setBookmarks(next);
    saveBookmarks(next);
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
      {activeTab === "home" && (
        <HomeScreen
          bookmarks={bookmarks}
          onOpenTab={() => setActiveTab("open")}
          onSaveTab={() => setActiveTab("save")}
        />
      )}
      {activeTab === "save" && <SaveScreen onSave={saveBookmark} onSaved={() => setActiveTab("home")} />}
      {activeTab === "search" && <SearchScreen bookmarks={bookmarks} onUpdateStatus={updateStatus} />}
      {activeTab === "open" && <OpenScreen bookmarks={bookmarks} onUpdateStatus={updateStatus} />}
      {activeTab === "pending" && <PendingScreen bookmarks={bookmarks} onUpdateStatus={updateStatus} />}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
