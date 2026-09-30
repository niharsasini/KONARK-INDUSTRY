import Link from "next/link";
import Image from "next/image";

export default function PowerLogo() {
  return (
    <Link href="/" aria-label="Konark Industry home" className="nb-logo-link">
      <Image src="/konark/KONARK-1.png" alt="Konark Industry" width={40} height={40} priority />
      <span className="nb-wordmark">KONARK</span>
    </Link>
  );
}
