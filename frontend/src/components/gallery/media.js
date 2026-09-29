export const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.konarkindustry.com";

export const CATEGORY_LABELS = {
  products: "Products",
  events: "Events",
  factory: "Factory",
  team: "Team",
  awards: "Awards",
  customers: "Customers",
};

export function youtubeId(url = "") {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/** Still image to show for a gallery item (video thumbnail, YouTube still, or the image itself). */
export function thumbFor(item) {
  if (item.thumbnail_url) return item.thumbnail_url;
  if (item.media_type !== "video") return item.url;
  const id = youtubeId(item.url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

export function formatAlbumDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
