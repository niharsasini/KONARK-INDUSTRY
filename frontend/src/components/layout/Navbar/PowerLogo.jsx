import Link from "next/link";
import Image from "next/image";

export default function PowerLogo({ size = 48 }) {
  return (
    <Link href="/" aria-label="Konark Industry home" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
      <Image src="/konark/KONARK-1.png" alt="Konark Industry" width={56} height={56} priority style={{ width: size, height: size, objectFit: "contain", transition: "width 0.3s ease, height 0.3s ease" }} />
    </Link>
  );
}
