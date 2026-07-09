import { useEffect, useMemo, useState } from "react";
import BottomNav from "./components/BottomNav";
import HomeScreen from "./screens/HomeScreen";
import OpenScreen from "./screens/OpenScreen";
import PendingScreen from "./screens/PendingScreen";
import SaveScreen from "./screens/SaveScreen";
import SearchScreen from "./screens/SearchScreen";
import {
  loadBookmarks,
  loadSelectedTarget,
  saveBookmarks,
  saveSelectedTarget,
} from "./storage";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState("");

  useEffect(() => {
    const loadedBookmarks = loadBookmarks();
    const storedTarget = loadSelectedTarget();
    setBookmarks(loadedBookmarks);
    setSelectedTarget(
      loadedBookmarks.some((bookmark) => bookmark.targetName === storedTarget)
        ? storedTarget
        : "",
    );
  }, []);

  const targets = useMemo(
    () =>
      [...new Set(bookmarks.map((bookmark) => bookmark.targetName).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b, "ja"),
      ),
    [bookmarks],
  );

  function persistBookmarks(nextBookmarks) {
    setBookmarks(nextBookmarks);
    saveBookmarks(nextBookmarks);
  }

  function handleSave(bookmark) {
    persistBookmarks([bookmark, ...bookmarks]);
    setSelectedTarget(bookmark.targetName);
    saveSelectedTarget(bookmark.targetName);
  }

  function handleSelectTarget(targetName) {
    setSelectedTarget(targetName);
    saveSelectedTarget(targetName);
  }

  function handleDelete(id) {
    const nextBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
    persistBookmarks(nextBookmarks);

    if (!nextBookmarks.some((bookmark) => bookmark.targetName === selectedTarget)) {
      setSelectedTarget("");
      saveSelectedTarget("");
    }
  }

  function handleUpdateStatus(id, status) {
    persistBookmarks(
      bookmarks.map((bookmark) =>
        bookmark.id === id ? { ...bookmark, status } : bookmark,
      ),
    );
  }

  return (
    <div className="app-shell">
      {activeTab === "home" && (
        <HomeScreen bookmarks={bookmarks} onOpenTab={() => setActiveTab("open")} />
      )}
      {activeTab === "save" && <SaveScreen onSave={handleSave} />}
      {activeTab === "search" && (
        <SearchScreen
          bookmarks={bookmarks}
          onSelectTarget={handleSelectTarget}
          onUpdateStatus={handleUpdateStatus}
          selectedTarget={selectedTarget}
          targets={targets}
        />
      )}
      {activeTab === "open" && (
        <OpenScreen bookmarks={bookmarks} onUpdateStatus={handleUpdateStatus} />
      )}
      {activeTab === "pending" && (
        <PendingScreen
          bookmarks={bookmarks}
          onDelete={handleDelete}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
