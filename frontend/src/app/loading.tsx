import Image from "next/image";

export default function Loading() {
  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Image src="/konark/KONARK-1.png" alt="Konark Industry" width={72} height={72} priority style={{ width: 72, height: 72, objectFit: "contain" }} />
      </div>
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid var(--border-default)", borderTopColor: "var(--navy)", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
