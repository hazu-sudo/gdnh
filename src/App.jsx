import { useEffect, useMemo, useState } from "react";
import BottomNav from "./components/BottomNav";
import BoxScreen from "./screens/BoxScreen";
import HomeScreen from "./screens/HomeScreen";
import OpenScreen from "./screens/OpenScreen";
import SaveScreen from "./screens/SaveScreen";
import SearchScreen from "./screens/SearchScreen";
import {
  loadBookmarks,
  loadSelectedPerson,
  saveBookmarks,
  saveSelectedPerson,
} from "./storage";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");

  useEffect(() => {
    const loadedBookmarks = loadBookmarks();
    const storedPerson = loadSelectedPerson();
    setBookmarks(loadedBookmarks);
    setSelectedPerson(
      loadedBookmarks.some((bookmark) => bookmark.person === storedPerson)
        ? storedPerson
        : "",
    );
  }, []);

  const people = useMemo(
    () =>
      [...new Set(bookmarks.map((bookmark) => bookmark.person).filter(Boolean))].sort(
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
    setSelectedPerson(bookmark.person);
    saveSelectedPerson(bookmark.person);
  }

  function handleSelectPerson(person) {
    setSelectedPerson(person);
    saveSelectedPerson(person);
  }

  function handleDelete(id) {
    const nextBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
    persistBookmarks(nextBookmarks);

    if (!nextBookmarks.some((bookmark) => bookmark.person === selectedPerson)) {
      setSelectedPerson("");
      saveSelectedPerson("");
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
          onSelectPerson={handleSelectPerson}
          onUpdateStatus={handleUpdateStatus}
          people={people}
          selectedPerson={selectedPerson}
        />
      )}
      {activeTab === "open" && (
        <OpenScreen bookmarks={bookmarks} onUpdateStatus={handleUpdateStatus} />
      )}
      {activeTab === "box" && (
        <BoxScreen
          bookmarks={bookmarks}
          onDelete={handleDelete}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
