"use client";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const VALID_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_BYTES = 5 * 1024 * 1024;

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!VALID_TYPES.includes(file.type)) {
      setError("Please select a JPEG, PNG or WebP image");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File must be under 5MB");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setError("");
    setUploading(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 15, 85));
    }, 200);

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
      setProgress(100);
      onChange(data.url);
      toast.success("Image uploaded!");
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 400);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      toast.error(message);
      setUploading(false);
      setProgress(0);
    } finally {
      clearInterval(progressInterval);
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, display: "block", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {label}
        </label>
      )}

      {value && (
        <div
          style={{
            marginBottom: 10, borderRadius: 12, overflow: "hidden",
            background: "var(--bg-surface)", border: "1px solid rgba(92,103,149,0.2)",
            position: "relative", height: 160,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <img
            src={value}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            title="Remove image"
            style={{
              position: "absolute", top: 8, right: 8,
              background: "rgba(255,92,92,0.85)", border: "none", borderRadius: "50%",
              width: 28, height: 28, color: "#fff", cursor: "pointer", fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>
      )}

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        style={{
          border: "2px dashed",
          borderColor: uploading ? "var(--sky)" : error ? "var(--red)" : "rgba(92,103,149,0.3)",
          borderRadius: 12, padding: "24px 16px", textAlign: "center",
          cursor: uploading ? "not-allowed" : "pointer",
          background: "var(--bg-surface)", transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (uploading) return;
          e.currentTarget.style.borderColor = "var(--sky)";
          e.currentTarget.style.background = "var(--bg-card)";
        }}
        onMouseLeave={(e) => {
          if (uploading) return;
          e.currentTarget.style.borderColor = error ? "var(--red)" : "rgba(92,103,149,0.3)";
          e.currentTarget.style.background = "var(--bg-surface)";
        }}
      >
        {uploading ? (
          <div>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📤</div>
            <div style={{ color: "var(--sky)", fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
              Uploading... {progress}%
            </div>
            <div style={{ background: "var(--bg-card)", borderRadius: 999, height: 6, overflow: "hidden" }}>
              <div
                style={{
                  background: "linear-gradient(90deg, var(--navy), var(--sky))",
                  height: "100%", width: `${progress}%`,
                  transition: "width 0.2s ease", borderRadius: 999,
                }}
              />
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{value ? "🔄" : "📁"}</div>
            <div style={{ color: "var(--text-heading)", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
              {value ? "Click to replace image" : "Click to browse & upload"}
            </div>
            <div style={{ color: "var(--text-subtle)", fontSize: 12 }}>JPEG, PNG or WebP · Max 5MB</div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          style={{ display: "none" }}
          disabled={uploading}
        />
      </div>

      {error && (
        <p style={{ color: "var(--red)", fontSize: 12, marginTop: 6, fontWeight: 500 }}>⚠️ {error}</p>
      )}

      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL directly..."
          style={{
            width: "100%", background: "var(--bg-surface)", border: "1px solid rgba(92,103,149,0.2)",
            borderRadius: 8, padding: "8px 12px", color: "var(--text-muted)", fontSize: 12, outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}
