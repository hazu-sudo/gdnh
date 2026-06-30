import { useEffect, useMemo, useState } from "react";
import BottomNav from "./components/BottomNav";
import BeforeMeetScreen from "./screens/BeforeMeetScreen";
import HomeScreen from "./screens/HomeScreen";
import PeopleScreen from "./screens/PeopleScreen";
import SaveScreen from "./screens/SaveScreen";
import UnsentScreen from "./screens/UnsentScreen";
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
      {activeTab === "home" && <HomeScreen bookmarks={bookmarks} />}
      {activeTab === "save" && <SaveScreen onSave={handleSave} />}
      {activeTab === "before" && (
        <BeforeMeetScreen
          bookmarks={bookmarks}
          onSelect={handleSelectPerson}
          onUpdateStatus={handleUpdateStatus}
          people={people}
          selectedPerson={selectedPerson}
        />
      )}
      {activeTab === "people" && (
        <PeopleScreen
          bookmarks={bookmarks}
          onDelete={handleDelete}
          onSelect={handleSelectPerson}
          people={people}
          selectedPerson={selectedPerson}
        />
      )}
      {activeTab === "unsent" && (
        <UnsentScreen bookmarks={bookmarks} onUpdateStatus={handleUpdateStatus} />
      )}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
