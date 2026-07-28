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

function MarqueeRow({ items, iconColor, textColor, speed, reverse }) {
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
            <span style={{ color: textColor, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>{item.text}</span>
            <span style={{ color: "rgba(92,103,149,0.3)", marginLeft: 8 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MarqueeStrip() {
  return (
    <div style={{
      background: "rgba(13,27,53,0.8)",
      backdropFilter: "blur(8px)",
      borderTop: "1px solid rgba(92,103,149,0.12)",
      borderBottom: "1px solid rgba(92,103,149,0.12)",
      padding: "16px 0",
      overflow: "hidden",
      maxWidth: "100vw",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}>
      <MarqueeRow items={ROW1_ITEMS} iconColor="#F4C430" textColor="#7B8DB8" speed={25} reverse={false} />
      <MarqueeRow items={ROW2_ITEMS} iconColor="#F4C430" textColor="#7B8DB8" speed={35} reverse={true} />
    </div>
  );
}
