import { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav.jsx";
import SaveScreen from "./screens/SaveScreen.jsx";
import SearchScreen from "./screens/SearchScreen.jsx";
import SettingsScreen from "./screens/SettingsScreen.jsx";
import ReflectionScreen from "./screens/ReflectionScreen.jsx";
import HintScreen from "./screens/HintScreen.jsx";
import {
  loadHintIntroSeen,
  loadHintVisibility,
  loadBookmarks,
  loadFontSize,
  loadMobileHints,
  loadReflectionVisibility,
  loadSenderName,
  loadTheme,
  saveHintIntroSeen,
  saveHintVisibility,
  saveBookmarks,
  saveFontSize,
  saveMobileHints,
  saveReflectionVisibility,
  saveSenderName,
  saveTheme,
} from "./storage.js";

export default function App() {
  const [activeTab, setActiveTab] = useState("save");
  const [bookmarks, setBookmarks] = useState([]);
  const [fontSize, setFontSize] = useState("standard");
  const [theme, setTheme] = useState("orange");
  const [showReflection, setShowReflection] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [hintIntroSeen, setHintIntroSeen] = useState(false);
  const [mobileHints, setMobileHints] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [prefilledMemo, setPrefilledMemo] = useState("");

  useEffect(() => {
    setBookmarks(loadBookmarks());
    setFontSize(loadFontSize());
    setTheme(loadTheme());
    setShowReflection(loadReflectionVisibility());
    setShowHints(loadHintVisibility());
    setHintIntroSeen(loadHintIntroSeen());
    setMobileHints(loadMobileHints());
    setSenderName(loadSenderName());
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
    if (!visible && activeTab === "reflection") setActiveTab("save");
  }

  function updateHintVisibility(visible) {
    setShowHints(visible);
    saveHintVisibility(visible);
    if (!visible && activeTab === "hints") setActiveTab("save");
  }

  function markHintIntroSeen() {
    setHintIntroSeen(true);
    saveHintIntroSeen();
  }

  function updateMobileHints(visible) {
    setMobileHints(visible);
    saveMobileHints(visible);
  }

  function updateSenderName(name) {
    setSenderName(name);
    saveSenderName(name);
  }

  function useHintAsBookmark(text) {
    setPrefilledMemo(text);
    setActiveTab("save");
  }

  return (
    <div className="app-shell">
      {activeTab === "save" && (
        <SaveScreen
          bookmarks={bookmarks}
          initialMemo={prefilledMemo}
          onInitialMemoConsumed={() => setPrefilledMemo("")}
          onSave={addBookmark}
          onShowBookmarks={() => setActiveTab("search")}
        />
      )}
      {activeTab === "search" && (
        <SearchScreen
          bookmarks={bookmarks}
          onUpdateBookmark={updateBookmark}
          onUpdateStatus={updateStatus}
          senderName={senderName}
        />
      )}
      {activeTab === "hints" && showHints && <HintScreen onUseHint={useHintAsBookmark} />}
      {activeTab === "reflection" && showReflection && (
        <ReflectionScreen bookmarks={bookmarks} />
      )}
      {activeTab === "settings" && (
        <SettingsScreen
          fontSize={fontSize}
          hintIntroSeen={hintIntroSeen}
          mobileHints={mobileHints}
          onFontSizeChange={updateFontSize}
          onHintIntroSeen={markHintIntroSeen}
          onHintVisibilityChange={updateHintVisibility}
          onMobileHintsChange={updateMobileHints}
          onReflectionChange={updateReflectionVisibility}
          onSenderNameChange={updateSenderName}
          onThemeChange={updateTheme}
          senderName={senderName}
          showHints={showHints}
          showReflection={showReflection}
          theme={theme}
        />
      )}
      <BottomNav
        activeTab={activeTab}
        onChange={setActiveTab}
        showHints={showHints}
        showReflection={showReflection}
      />
    </div>
  );
}
