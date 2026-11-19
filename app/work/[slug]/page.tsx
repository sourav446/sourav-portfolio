import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudyPages } from "@/lib/content";
import CaseStudyView from "@/components/CaseStudyView";

/** Full case-study pages, one per project with a write-up: /work/live-classroom, … */
export function generateStaticParams() {
  return caseStudyPages().map(({ project }) => ({ slug: project.slug! }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = caseStudyPages().find(({ project }) => project.slug === params.slug);
  if (!page) return {};
  const { project, study } = page;
  return {
    title: `${project.short} case study | Sourav Gokul V`,
    description: `${study.title}. ${project.summary}`,
    alternates: { canonical: `/work/${params.slug}` },
  };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const pages = caseStudyPages();
  const index = pages.findIndex(({ project }) => project.slug === params.slug);
  if (index < 0) notFound();
  const next = pages[(index + 1) % pages.length];
  return (
    <CaseStudyView
      index={index}
      total={pages.length}
      project={pages[index].project}
      study={pages[index].study}
      next={{ slug: next.project.slug!, title: next.project.title }}
    />
  );
}
