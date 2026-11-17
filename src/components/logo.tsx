import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className="brand" aria-label="Nexora Digital — início">
    <Image src={compact ? "/nexora-symbol.png" : "/nexora-logo.png"} alt="Nexora Digital" width={compact ? 42 : 170} height={compact ? 42 : 56} priority className={compact ? "brand-symbol" : "brand-wordmark"} />
  </Link>;
}
