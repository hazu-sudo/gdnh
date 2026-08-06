import { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav.jsx";
import AuthScreen from "./components/AuthScreen.jsx";
import BookCoverScreen from "./components/BookCoverScreen.jsx";
import SaveScreen from "./screens/SaveScreen.jsx";
import SearchScreen from "./screens/SearchScreen.jsx";
import SettingsScreen from "./screens/SettingsScreen.jsx";
import ReflectionScreen from "./screens/ReflectionScreen.jsx";
import HintScreen from "./screens/HintScreen.jsx";
import { deleteAttachmentsForBookmark } from "./attachmentStore.js";
import { useCloudSync } from "./cloud/useCloudSync.js";

export default function App() {
  const [activeTab, setActiveTab] = useState("save");
  const [prefilledMemo, setPrefilledMemo] = useState("");
  const [attachmentRevision, setAttachmentRevision] = useState(0);
  const [bookOpened, setBookOpened] = useState(false);
  const sync = useCloudSync();

  const {
    fontSize = "standard",
    colorTheme = sync.settings.themeColor || sync.settings.backgroundColor || sync.settings.theme || "orange",
    showReflection = true,
    showHints = false,
    hintIntroSeen = false,
    senderName = "",
    showBookIntro = true,
  } = sync.settings;

  useEffect(() => {
    document.documentElement.dataset.fontSize = fontSize;
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.dataset.backgroundColor = colorTheme;
    document.documentElement.dataset.themeColor = colorTheme;
    delete document.documentElement.dataset.theme;
  }, [colorTheme]);

  if (sync.cloudConfigured && !sync.authReady) {
    return <div className="app-loading" role="status">しおりを開いています…</div>;
  }

  if (sync.cloudConfigured && !sync.session) {
    return <AuthScreen />;
  }

  if (showBookIntro && !bookOpened) {
    return <BookCoverScreen bookmarks={sync.bookmarks} onOpen={() => setBookOpened(true)} />;
  }

  async function deleteBookmark(id) {
    sync.deleteBookmark(id);
    await deleteAttachmentsForBookmark(id).catch(() => {});
    setAttachmentRevision((current) => current + 1);
  }

  function updateReflectionVisibility(visible) {
    sync.updateSettings({ showReflection: visible });
    if (!visible && activeTab === "reflection") setActiveTab("save");
  }

  function updateHintVisibility(visible) {
    sync.updateSettings({ showHints: visible });
    if (!visible && activeTab === "hints") setActiveTab("save");
  }

  function useHintAsBookmark(text) {
    setPrefilledMemo(text);
    setActiveTab("save");
  }

  return (
    <div className="app-shell">
      {sync.syncStatus === "waiting" && (
        <div className="sync-pill waiting" role="status">同期待ち</div>
      )}
      {sync.syncStatus === "error" && (
        <button className="sync-pill error" onClick={() => sync.pullCloud()} type="button">
          同期できませんでした
        </button>
      )}

      {activeTab === "save" && (
        <SaveScreen
          bookmarks={sync.bookmarks}
          cloudConfigured={sync.cloudConfigured}
          initialMemo={prefilledMemo}
          onAttachmentsChanged={() => setAttachmentRevision((current) => current + 1)}
          onInitialMemoConsumed={() => setPrefilledMemo("")}
          onSave={sync.addBookmark}
          onShowBookmarks={() => setActiveTab("search")}
        />
      )}
      {activeTab === "search" && (
        <SearchScreen
          bookmarks={sync.bookmarks}
          onDeleteBookmark={deleteBookmark}
          onUpdateBookmark={sync.updateBookmark}
          onUpdateStatus={sync.updateStatus}
          onAttachmentsChanged={() => setAttachmentRevision((current) => current + 1)}
          senderName={senderName}
          backgroundColor={colorTheme}
          themeColor={colorTheme}
        />
      )}
      {activeTab === "hints" && showHints && <HintScreen onUseHint={useHintAsBookmark} />}
      {activeTab === "reflection" && showReflection && (
        <ReflectionScreen bookmarks={sync.bookmarks} />
      )}
      {activeTab === "settings" && (
        <SettingsScreen
          accountEmail={sync.user?.email || ""}
          attachmentRevision={attachmentRevision}
          colorTheme={colorTheme}
          cloudConfigured={sync.cloudConfigured}
          fontSize={fontSize}
          hintIntroSeen={hintIntroSeen}
          lastSyncAt={sync.lastSyncAt}
          onColorThemeChange={(color) => sync.updateSettings({ colorTheme: color })}
          onFontSizeChange={(size) => sync.updateSettings({ fontSize: size })}
          onHintIntroSeen={() => sync.updateSettings({ hintIntroSeen: true })}
          onHintVisibilityChange={updateHintVisibility}
          onBookIntroChange={(visible) => {
            sync.updateSettings({ showBookIntro: visible });
            if (visible) setBookOpened(true);
          }}
          onReflectionChange={updateReflectionVisibility}
          onSenderNameChange={(name) => sync.updateSettings({ senderName: name })}
          onSignOut={sync.signOut}
          onSyncNow={() => sync.pullCloud({ allowMigration: false })}
          senderName={senderName}
          showHints={showHints}
          showBookIntro={showBookIntro}
          showReflection={showReflection}
          syncStatus={sync.syncStatus}
        />
      )}
      <BottomNav
        activeTab={activeTab}
        onChange={setActiveTab}
        showHints={showHints}
        showReflection={showReflection}
      />

      {sync.migrationPending && (
        <div className="modal-backdrop">
          <section aria-modal="true" className="confirm-dialog migration-dialog" role="dialog">
            <span className="dialog-bookmark" aria-hidden="true" />
            <h2>この端末のしおりを保存しますか？</h2>
            <p>端末にあるしおり・設定・写真や資料を、ログイン中のアカウントへ保存します。</p>
            <div>
              <button className="secondary-button" onClick={sync.skipMigration} type="button">今はしない</button>
              <button className="primary-button" onClick={sync.migrateLocalData} type="button">アカウントへ保存する</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
