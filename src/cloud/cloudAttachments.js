import { cloudConfigured, supabase } from "./supabaseClient.js";

const BUCKET = "shiori-attachments";

function safeFileName(name = "attachment") {
  return String(name).replace(/[^\p{L}\p{N}._-]+/gu, "-").slice(0, 120) || "attachment";
}

export async function uploadCloudAttachment(record, userId) {
  if (!cloudConfigured || !supabase || !record?.blob || !userId) return null;
  const path = `${userId}/${record.bookmarkId}/${record.id}-${safeFileName(record.name)}`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, record.blob, { contentType: record.type, upsert: true });
  if (uploadError) throw uploadError;

  const { error: metadataError } = await supabase.from("attachments").upsert({
    id: record.id,
    user_id: userId,
    bookmark_id: record.bookmarkId,
    storage_path: path,
    file_name: record.name,
    file_type: record.type,
    file_size: record.size,
    width: record.width,
    height: record.height,
    attached_at: record.attachedAt,
  });
  if (metadataError) throw metadataError;
  return path;
}

export async function downloadCloudAttachment(id) {
  if (!cloudConfigured || !supabase || !id) return null;
  const { data: metadata, error } = await supabase
    .from("attachments")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !metadata) return null;

  const { data: blob, error: downloadError } = await supabase.storage
    .from(BUCKET)
    .download(metadata.storage_path);
  if (downloadError || !blob) return null;
  return {
    id: metadata.id,
    bookmarkId: metadata.bookmark_id,
    blob,
    type: metadata.file_type,
    name: metadata.file_name,
    size: metadata.file_size,
    width: metadata.width,
    height: metadata.height,
    attachedAt: metadata.attached_at,
  };
}

export async function deleteCloudAttachment(id) {
  if (!cloudConfigured || !supabase || !id) return;
  const { data: metadata } = await supabase
    .from("attachments")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();
  if (metadata?.storage_path) {
    await supabase.storage.from(BUCKET).remove([metadata.storage_path]);
  }
  await supabase.from("attachments").delete().eq("id", id);
}

