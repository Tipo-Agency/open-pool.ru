export function BrandLogo({ className = "" }: { className?: string }) {
  return <img className={`brand-logo${className ? ` ${className}` : ""}`} src="/logo-nautilus.svg" width={1781} height={854} alt="" />;
}
