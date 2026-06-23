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
            style={{ width: 220, background: "#0e1928", border: "1px solid #38bdf8", color: "#f1f5f9", fontSize: 13, padding: "7px 12px", borderRadius: 8, outline: "none" }}
          />
          {searchPreview.length > 0 && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#0c1525", border: "1px solid #1c3050", borderRadius: 12, zIndex: 300, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
              {searchPreview.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", textDecoration: "none", transition: "background 150ms" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(56,189,248,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                >
                  <div style={{ width: 32, height: 32, background: "#0e1928", borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <Image src={p.image} alt={p.name} fill style={{ objectFit: "contain", padding: 2 }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{p.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setSearchOpen(true)}
          style={{ padding: 8, color: "#94a3b8", background: "transparent", border: "none", cursor: "pointer", borderRadius: 8, transition: "color 0.2s", display: "flex", alignItems: "center" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#38bdf8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 20, height: 20 }}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
      )}
    </div>
  );
}
