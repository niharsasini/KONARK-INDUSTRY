import Link from "next/link";
import Image from "next/image";

export default function PowerLogo() {
  return (
    <Link href="/" aria-label="Konark Industry home" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
      <Image src="/konark/KONARK-1.png" alt="Konark Industry" width={48} height={48} priority style={{ width: 48, height: 48, objectFit: "contain" }} />
    </Link>
  );
}
