import photos from "./pool-photos.json";

// Shared responsive delivery for the pool's existing photographs.
export function poolImageProps(src: string, priority = false, sizes = "(max-width: 760px) 100vw, 50vw") {
  const photo = (photos as Record<string, { name: string; width: number; height: number; widths: number[] }>)[src];
  if (!photo) return { src, loading: priority ? "eager" as const : "lazy" as const, decoding: "async" as const };
  const largest = photo.widths.at(-1)!;
  return {
    src: `/photos/${photo.name}-${largest}.webp`,
    srcSet: photo.widths.map(width => `/photos/${photo.name}-${width}.webp ${width}w`).join(", "),
    sizes,
    width: photo.width,
    height: photo.height,
    loading: priority ? "eager" as const : "lazy" as const,
    fetchPriority: priority ? "high" as const : "auto" as const,
    decoding: "async" as const,
  };
}
