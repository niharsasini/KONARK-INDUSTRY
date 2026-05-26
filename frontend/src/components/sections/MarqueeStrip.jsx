const ROW1_ITEMS = [
  { icon: "⚡", text: "EV Scooters" },
  { icon: "🛺", text: "E-Rickshaws" },
  { icon: "🔋", text: "LFP Batteries" },
  { icon: "🌀", text: "BLDC Fans" },
  { icon: "❄️", text: "Air Conditioners" },
  { icon: "☀️", text: "Solar Inverters" },
];

const ROW2_ITEMS = [
  { icon: "🔧", text: "AC Repair" },
  { icon: "⚡", text: "EV Charger Install" },
  { icon: "🏠", text: "Home Wiring" },
  { icon: "🔋", text: "Battery Setup" },
  { icon: "☀️", text: "Solar Install" },
  { icon: "🏭", text: "Industrial Electrical" },
];

function MarqueeRow({ items, iconColor, speed, reverse }) {
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div
        style={{
          display: "inline-flex",
          gap: 40,
          whiteSpace: "nowrap",
          width: "max-content",
          animation: `${reverse ? "marquee-reverse" : "marquee"} ${speed}s linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: iconColor }}>{item.icon}</span>
            <span style={{ color: "#475569", fontSize: 13, fontWeight: 500 }}>{item.text}</span>
            <span style={{ color: "#1e2d40", marginLeft: 8 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MarqueeStrip() {
  return (
    <div style={{
      background: "#060d1a",
      borderTop: "1px solid #0f1e2e",
      borderBottom: "1px solid #0f1e2e",
      padding: "12px 0",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}>
      <MarqueeRow items={ROW1_ITEMS} iconColor="#00d4ff" speed={25} reverse={false} />
      <MarqueeRow items={ROW2_ITEMS} iconColor="#7c3aed" speed={35} reverse={true} />
    </div>
  );
}
