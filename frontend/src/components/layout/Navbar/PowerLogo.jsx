import Link from "next/link";
import Image from "next/image";

/* Bare logo, no pill or background */
export default function PowerLogo() {
  return (
    <Link href="/" aria-label="Konark Industry home" className="nb-logo-link">
      <Image src="/konark/KONARK-1.png" alt="Konark Industry" width={56} height={56} priority />
    </Link>
  );
}
