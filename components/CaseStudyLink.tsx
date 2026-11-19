import { ArrowRight } from "lucide-react";

/**
 * "Read case study" pill on a project card: dark pill, orange arrow circle that turns on hover.
 * Opens the project's full write-up at /work/<slug>. A plain link (full page load, not client-side
 * routing): the browser shows its loading state straight away, and the smooth-scroll library never
 * gets in the way. The intro only plays once per session, so it does not replay.
 */
export default function CaseStudyLink({ slug, className = "" }: { slug: string; className?: string }) {
  return (
    <a
      href={`/work/${slug}`}
      className={`group/cs inline-flex h-10 w-fit items-center gap-2.5 rounded-full bg-foreground py-1 pr-1 pl-5 text-sm font-medium text-background transition-[box-shadow,transform] duration-300 hover:shadow-[0_14px_30px_-16px_rgba(0,0,0,0.55)] active:scale-[0.98] ${className}`}
    >
      Read case study
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cs:-rotate-45">
        <ArrowRight className="h-4 w-4" />
      </span>
    </a>
  );
}
