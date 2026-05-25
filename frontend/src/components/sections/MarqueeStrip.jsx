const ITEMS = [
  "EV Scooters", "LFP Batteries", "BLDC Fans", "Solar Inverters",
  "Industrial Motors", "Smart Chargers", "Cold Storage", "PCB Manufacturing", "EV Infrastructure",
];

const content = [...ITEMS, ...ITEMS].map((item, i) => (
  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10, marginRight: 40 }}>
    <span style={{ color: "#00d4ff" }}>⚡</span>
    <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>{item}</span>
  </span>
));

export default function MarqueeStrip() {
  return (
    <div style={{ background: "#111827", borderTop: "1px solid #1e2d40", borderBottom: "1px solid #1e2d40", padding: "14px 0", overflow: "hidden" }}>
      <div className="animate-marquee" style={{ display: "inline-flex", whiteSpace: "nowrap" }}>
        {content}
        {content}
      </div>
    </div>
  );
}
