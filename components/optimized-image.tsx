import Image, { ImageProps } from "next/image";

/**
 * Use for images below the fold. Lazy loads by default.
 * For above-the-fold hero images, pass priority.
 */
export function OptimizedImage({
  alt,
  loading,
  ...props
}: ImageProps) {
  return (
    <Image
      alt={alt}
      loading={loading ?? "lazy"}
      {...props}
    />
  );
}
