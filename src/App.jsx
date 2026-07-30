import { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav.jsx";
import SaveScreen from "./screens/SaveScreen.jsx";
import SearchScreen from "./screens/SearchScreen.jsx";
import SettingsScreen from "./screens/SettingsScreen.jsx";
import ReflectionScreen from "./screens/ReflectionScreen.jsx";
import HintScreen from "./screens/HintScreen.jsx";
import { deleteAttachmentsForBookmark } from "./attachmentStore.js";
import {
  loadHintIntroSeen,
  loadHintVisibility,
  loadBookmarks,
  loadFontSize,
  loadReflectionVisibility,
  loadSenderName,
  loadTheme,
  saveHintIntroSeen,
  saveHintVisibility,
  saveBookmarks,
  saveFontSize,
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
  const [senderName, setSenderName] = useState("");
  const [prefilledMemo, setPrefilledMemo] = useState("");
  const [attachmentRevision, setAttachmentRevision] = useState(0);

  useEffect(() => {
    setBookmarks(loadBookmarks());
    setFontSize(loadFontSize());
    setTheme(loadTheme());
    setShowReflection(loadReflectionVisibility());
    setShowHints(loadHintVisibility());
    setHintIntroSeen(loadHintIntroSeen());
    setSenderName(loadSenderName());
  }, []);

  useEffect(() => {
    document.documentElement.dataset.fontSize = fontSize;
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function addBookmark(bookmark) {
    const next = [bookmark, ...bookmarks];
    saveBookmarks(next);
    setBookmarks(next);
  }

  function updateStatus(id, status) {
    setBookmarks((current) => {
      const next = current.map((item) => item.id === id ? { ...item, status } : item);
      saveBookmarks(next);
      return next;
    });
  }

  function updateBookmark(id, changes) {
    const next = bookmarks.map((item) => item.id === id ? { ...item, ...changes } : item);
    saveBookmarks(next);
    setBookmarks(next);
  }

  async function deleteBookmark(id) {
    const next = bookmarks.filter((item) => item.id !== id);
    saveBookmarks(next);
    setBookmarks(next);
    await deleteAttachmentsForBookmark(id).catch(() => {});
    setAttachmentRevision((current) => current + 1);
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
          onAttachmentsChanged={() => setAttachmentRevision((current) => current + 1)}
          onInitialMemoConsumed={() => setPrefilledMemo("")}
          onSave={addBookmark}
          onShowBookmarks={() => setActiveTab("search")}
        />
      )}
      {activeTab === "search" && (
        <SearchScreen
          bookmarks={bookmarks}
          onDeleteBookmark={deleteBookmark}
          onUpdateBookmark={updateBookmark}
          onUpdateStatus={updateStatus}
          onAttachmentsChanged={() => setAttachmentRevision((current) => current + 1)}
          senderName={senderName}
          theme={theme}
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
          attachmentRevision={attachmentRevision}
          onFontSizeChange={updateFontSize}
          onHintIntroSeen={markHintIntroSeen}
          onHintVisibilityChange={updateHintVisibility}
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
