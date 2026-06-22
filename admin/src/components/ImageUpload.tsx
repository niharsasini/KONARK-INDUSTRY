"use client";
import { useState } from "react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const token = localStorage.getItem("konark_admin_token");

      const res = await fetch(`${BACKEND}/api/v1/products/upload-image`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Upload failed");
      }

      const data = await res.json();
      onChange(data.url);
      setPreview(data.url);
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
      setPreview(value);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setPreview(e.target.value);
        }}
        placeholder="/productimg/name.png or paste URL"
        style={{
          flex: 1,
          background: "#0f172a",
          border: "1px solid #1e2d40",
          borderRadius: 8,
          padding: "10px 14px",
          color: "#f1f5f9",
          fontSize: 13,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      <label
        style={{
          background: uploading ? "#1e2d40" : "#0f172a",
          border: "1px solid #334155",
          color: uploading ? "#64748b" : "#94a3b8",
          padding: "10px 14px",
          borderRadius: 8,
          cursor: uploading ? "not-allowed" : "pointer",
          fontSize: 13,
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {uploading ? "⏳ Uploading..." : "📁 Upload"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
          disabled={uploading}
          onChange={handleFile}
        />
      </label>
      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{
            width: 48,
            height: 48,
            objectFit: "cover",
            borderRadius: 8,
            border: "1px solid #1e2d40",
            background: "#0f172a",
            flexShrink: 0,
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
    </div>
  );
}
