import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="shell flex min-h-screen flex-col justify-between py-8">
      <div className="label flex justify-between border-b border-border pb-3">
        <span>Sourav Gokul V</span>
        <span>Error 404</span>
      </div>
      <div>
        <h1 className="font-display text-[30vw] leading-[0.8] font-medium tracking-[-0.07em] md:text-[22vw]">
          404<span className="text-accent">.</span>
        </h1>
        <p className="mt-8 max-w-md text-lg text-muted-foreground">
          This page doesn&apos;t exist — it may have moved, or the link is wrong.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex h-12 items-center self-start rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-accent"
      >
        Back to the homepage
      </Link>
    </main>
  );
}
