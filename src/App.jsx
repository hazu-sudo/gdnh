import { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav.jsx";
import SaveScreen from "./screens/SaveScreen.jsx";
import SearchScreen from "./screens/SearchScreen.jsx";
import SettingsScreen from "./screens/SettingsScreen.jsx";
import ReflectionScreen from "./screens/ReflectionScreen.jsx";
import {
  loadBookmarks,
  loadFontSize,
  loadReflectionVisibility,
  loadTheme,
  saveBookmarks,
  saveFontSize,
  saveReflectionVisibility,
  saveTheme,
} from "./storage.js";

export default function App() {
  const [activeTab, setActiveTab] = useState("save");
  const [bookmarks, setBookmarks] = useState([]);
  const [fontSize, setFontSize] = useState("standard");
  const [theme, setTheme] = useState("orange");
  const [showReflection, setShowReflection] = useState(true);

  useEffect(() => {
    setBookmarks(loadBookmarks());
    setFontSize(loadFontSize());
    setTheme(loadTheme());
    setShowReflection(loadReflectionVisibility());
  }, []);

  useEffect(() => {
    document.documentElement.dataset.fontSize = fontSize;
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

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

  function updateBookmark(id, changes) {
    setBookmarks((current) => {
      const next = current.map((item) => item.id === id ? { ...item, ...changes } : item);
      saveBookmarks(next);
      return next;
    });
  }

  function updateFontSize(size) {
    setFontSize(size);
    saveFontSize(size);
  }

  function updateTheme(nextTheme) {
    setTheme(nextTheme);
    saveTheme(nextTheme);
  }

  function updateReflectionVisibility(visible) {
    setShowReflection(visible);
    saveReflectionVisibility(visible);
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
        <SearchScreen
          bookmarks={bookmarks}
          onUpdateBookmark={updateBookmark}
          onUpdateStatus={updateStatus}
        />
      )}
      {activeTab === "reflection" && showReflection && (
        <ReflectionScreen bookmarks={bookmarks} />
      )}
      {activeTab === "settings" && (
        <SettingsScreen
          fontSize={fontSize}
          onFontSizeChange={updateFontSize}
          onReflectionChange={updateReflectionVisibility}
          onThemeChange={updateTheme}
          showReflection={showReflection}
          theme={theme}
        />
      )}
      <BottomNav
        activeTab={activeTab}
        onChange={setActiveTab}
        showReflection={showReflection}
      />
    </div>
  );
}
