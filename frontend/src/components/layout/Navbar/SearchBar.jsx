import Link from "next/link";
import Image from "next/image";

/* Desktop search box + live preview dropdown */
export default function SearchBar({ searchOpen, setSearchOpen, searchQuery, setSearchQuery, searchPreview, router }) {
  return (
    <div style={{ position: "relative" }} className="nav-right-desktop">
      {searchOpen ? (
        <div style={{ position: "relative" }}>
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => setTimeout(() => { setSearchOpen(false); setSearchQuery(""); }, 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                setSearchOpen(false);
                setSearchQuery("");
              }
              if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
            }}
            placeholder="Search products..."
            style={{ width: 220, background: "var(--bg-card)", border: "1px solid var(--navy)", color: "var(--text-heading)", fontSize: 13, padding: "7px 12px", borderRadius: 8, outline: "none" }}
          />
          {searchPreview.length > 0 && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "var(--bg-card)", border: "1px solid var(--border-default)", borderRadius: 12, zIndex: 300, overflow: "hidden", boxShadow: "0 8px 32px rgba(10,14,26,0.5)" }}>
              {searchPreview.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", textDecoration: "none", transition: "background 150ms" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(92,103,149,0.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                >
                  <div style={{ width: 32, height: 32, background: "var(--bg-surface)", borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <Image src={p.image} alt={p.name} fill style={{ objectFit: "contain", padding: 2 }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-heading)", margin: 0 }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: "var(--text-subtle)", margin: 0 }}>{p.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setSearchOpen(true)}
          style={{ padding: 8, color: "var(--slate)", background: "transparent", border: "none", cursor: "pointer", borderRadius: 8, transition: "all 0.2s ease", display: "flex", alignItems: "center" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--sky)"; e.currentTarget.style.transform = "scale(1.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--slate)"; e.currentTarget.style.transform = "scale(1)"; }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 20, height: 20 }}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
      )}
    </div>
  );
}
