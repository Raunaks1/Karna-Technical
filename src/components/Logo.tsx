import Image from "next/image";

export default function Logo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <Image
      src="/images/karna-logo.png"
      alt="Karna Technical Services Logo"
      width={120}
      height={120}
      className={className}
      priority
    />
  );
}
