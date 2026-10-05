"use client";

/**
 * Pill button whose accent fill grows out from the exact point the cursor enters.
 * Renders an <a> when `href` is given, otherwise a <button>.
 */
type Props = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  /** Colour class for the growing fill (defaults to the accent). */
  fillClass?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function FillButton({
  children,
  className = "",
  href,
  fillClass = "bg-accent",
  ...rest
}: Props) {
  const setOrigin = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--fx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--fy", `${e.clientY - r.top}px`);
  };

  const inner = (
    <>
      <span
        aria-hidden
        className={`pointer-events-none absolute top-[var(--fy,50%)] left-[var(--fx,50%)] aspect-square w-[260%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full ${fillClass} transition-transform duration-500 ease-out-expo group-hover/fill:scale-100`}
      />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  );

  // Named group so a hover on an outer `.group` (e.g. a spotlight card) doesn't trigger the fill.
  const cls = `group/fill relative isolate inline-flex items-center justify-center overflow-hidden rounded-full ${className}`;

  if (href) {
    return (
      <a
        href={href}
        onPointerEnter={setOrigin}
        onPointerLeave={setOrigin}
        className={cls}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </a>
    );
  }
  return (
    <button
      onPointerEnter={setOrigin}
      onPointerLeave={setOrigin}
      className={cls}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {inner}
    </button>
  );
}
