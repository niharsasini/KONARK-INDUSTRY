import Link from "next/link";
import Image from "next/image";

/* Intrinsic size is 2x the largest displayed size (56px), so next/image serves crisp 1x/2x
   variants of the 1254px source. CSS controls the displayed size (56 / 48 compact / 44 mobile). */
export default function PowerLogo() {
  return (
    <Link href="/" aria-label="Konark Industry home" className="nb-logo-link">
      <Image src="/konark/KONARK-1.png" alt="Konark Industry" width={112} height={112} quality={90} priority />
    </Link>
  );
}
