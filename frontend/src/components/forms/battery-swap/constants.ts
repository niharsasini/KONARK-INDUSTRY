export const CITIES = ["Bhubaneswar", "Cuttack", "Puri", "Rourkela", "Berhampur", "Sambalpur", "Balasore", "Other"];
export const CAPACITIES = ["48V 20Ah", "48V 30Ah", "48V 50Ah", "48V 100Ah", "60V 30Ah", "72V 30Ah", "72V 50Ah", "72V 100Ah", "Other"];
export const YEARS = Array.from({ length: 10 }, (_, i) => 2015 + i);
export const BATTERY_TYPES = [
  { value: "LFP", label: "LFP", sub: "Lithium Iron Phosphate", icon: "🔋" },
  { value: "Lead Acid", label: "Lead Acid", sub: "Standard lead battery", icon: "⚡" },
  { value: "NMC", label: "NMC", sub: "Lithium NMC", icon: "💡" },
  { value: "Not Sure", label: "Not Sure", sub: "We'll identify it", icon: "❓" },
];
export const CONDITIONS = [
  { value: "Good", label: "Good", sub: "Charges and runs normally", icon: "✅" },
  { value: "Fair", label: "Fair", sub: "Some reduction in range", icon: "⚠️" },
  { value: "Poor", label: "Poor", sub: "Significant issues", icon: "❌" },
];
export const TIME_SLOTS = [
  { value: "Morning 9-12", label: "Morning", time: "9:00 AM – 12:00 PM", icon: "🌅" },
  { value: "Afternoon 12-4", label: "Afternoon", time: "12:00 PM – 4:00 PM", icon: "☀️" },
  { value: "Evening 4-7", label: "Evening", time: "4:00 PM – 7:00 PM", icon: "🌆" },
];
