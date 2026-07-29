import { useEffect, useRef, useState } from "react";
import { formatFileSize } from "../attachmentStore.js";

const FILE_ACCEPT = "image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv";

function useObjectUrl(blob) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!blob) {
      setUrl("");
      return undefined;
    }
    const nextUrl = URL.createObjectURL(blob);
    setUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [blob]);
  return url;
}

function FilePreview({ item }) {
  const blob = item?.blob || item;
  const url = useObjectUrl(blob);
  const type = item?.type || blob?.type || "";
  const name = item?.name || "添付ファイル";
  const size = item?.size ?? blob?.size ?? 0;

  if (!item) return null;

  return (
    <div className="attachment-preview">
      {type.startsWith("image/") && url ? (
        <a href={url} rel="noreferrer" target="_blank" aria-label={`${name}をプレビュー`}>
          <img alt={name} src={url} />
        </a>
      ) : (
        <a className="document-preview" href={url || undefined} rel="noreferrer" target="_blank">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg>
          <span><strong>{name}</strong><small>タップしてプレビュー</small></span>
        </a>
      )}
      <div className="attachment-meta">
        <strong>{name}</strong>
        <span>{type.startsWith("image/") ? "写真" : "資料"}・{formatFileSize(size)}</span>
        {item?.width && item?.height && <span>{item.width} × {item.height}px</span>}
      </div>
    </div>
  );
}

export default function AttachmentEditor({
  attachment,
  disabled,
  onChoose,
  onRequestRemove,
  pendingFile,
  readOnly = false,
  removed = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const photoInput = useRef(null);
  const cameraInput = useRef(null);
  const fileInput = useRef(null);
  const visibleItem = removed ? null : (pendingFile || attachment);

  function choose(event) {
    const file = event.target.files?.[0];
    if (file) onChoose(file);
    event.target.value = "";
    setMenuOpen(false);
  }

  if (readOnly) {
    return visibleItem ? <FilePreview item={visibleItem} /> : null;
  }

  return (
    <div className="attachment-editor">
      {visibleItem ? <FilePreview item={visibleItem} /> : (
        <div className="attachment-empty">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h4l1.5-2h5L16 7h4v12H4V7Z" /><circle cx="12" cy="13" r="3.2" /></svg>
          <p>写真や資料を一緒に挟めます</p>
        </div>
      )}
      <div className="attachment-controls">
        <button className="attachment-change-button" disabled={disabled} onClick={() => setMenuOpen(true)} type="button">
          {visibleItem ? "変更" : "添付する"}
        </button>
        {visibleItem && (
          <button className="attachment-remove-button" disabled={disabled} onClick={onRequestRemove} type="button">削除</button>
        )}
      </div>

      <input accept="image/*" className="sr-only" onChange={choose} ref={photoInput} type="file" />
      <input accept="image/*" capture="environment" className="sr-only" onChange={choose} ref={cameraInput} type="file" />
      <input accept={FILE_ACCEPT} className="sr-only" onChange={choose} ref={fileInput} type="file" />

      {menuOpen && (
        <div className="modal-backdrop" onClick={() => setMenuOpen(false)}>
          <section className="attachment-menu" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="添付方法を選ぶ">
            <h2>写真・資料を選ぶ</h2>
            <button onClick={() => photoInput.current?.click()} type="button">写真ライブラリから選ぶ</button>
            <button onClick={() => cameraInput.current?.click()} type="button">写真を撮る</button>
            <button onClick={() => fileInput.current?.click()} type="button">ファイルから選ぶ</button>
            <button className="attachment-menu-cancel" onClick={() => setMenuOpen(false)} type="button">キャンセル</button>
          </section>
        </div>
      )}
    </div>
  );
}
