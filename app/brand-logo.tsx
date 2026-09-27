export function BrandLogo({ className = "" }: { className?: string }) {
  return <img className={`brand-logo${className ? ` ${className}` : ""}`} src="/logo-nautilus.svg" alt="" />;
}
