interface CategoryIconProps {
  icon: string;
  /** Applied to the wrapper around an emoji, or use with img via `imageClassName` */
  className?: string;
  /** Applied to `<img>` when `icon` is a public URL */
  imageClassName?: string;
}

/** Renders a public `/icons/...` URL as an image, otherwise the string is shown (e.g. emoji). */
export default function CategoryIcon({ icon, className, imageClassName }: CategoryIconProps) {
  if (icon.startsWith('/')) {
    return (
      <img
        src={icon}
        alt=""
        width={40}
        height={40}
        decoding="async"
        className={imageClassName}
      />
    );
  }

  return <span className={className}>{icon}</span>;
}
