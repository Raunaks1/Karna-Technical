import Logo from "./Logo";

type LogoBadgeProps = {
  /** Size classes for the circular wrapper (must keep equal width/height). */
  wrapperClassName?: string;
  /** Classes for the logo image inside the circle. */
  imgClassName?: string;
};

/**
 * Shared circular white logo badge used in the navbar and footer
 * so the two never drift apart. The wrapper clips the logo PNG's
 * opaque white square corners; the slight scale hides any remnants.
 */
export default function LogoBadge({
  wrapperClassName = "w-11 h-11 lg:w-[52px] lg:h-[52px]",
  imgClassName = "w-full h-full object-cover rounded-full scale-110",
}: LogoBadgeProps) {
  return (
    <span
      className={`bg-white rounded-full overflow-hidden flex items-center justify-center shrink-0 ${wrapperClassName}`}
    >
      <Logo className={imgClassName} />
    </span>
  );
}
