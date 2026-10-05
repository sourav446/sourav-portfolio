"use client";

import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ResumeViewerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeUrl?: string;
  fileName?: string;
};

export default function ResumeViewer({
  open,
  onOpenChange,
  resumeUrl = "/resume.pdf",
  fileName = "Sourav-Gokul-V-Resume.pdf",
}: ResumeViewerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-lenis-prevent
        className="flex h-[90vh] max-w-5xl flex-col gap-0 rounded-md border-foreground/10 bg-background p-0"
      >
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <div className="flex items-center justify-between gap-4 pr-8">
            <div>
              <DialogTitle className="font-display text-xl font-medium tracking-[-0.03em]">
                Résumé
              </DialogTitle>
              <DialogDescription className="label mt-1">
                Sourav Gokul V — PDF
              </DialogDescription>
            </div>
            <a
              href={resumeUrl}
              download={fileName}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-accent"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 p-3 sm:p-4">
          <iframe
            src={resumeUrl}
            title="Résumé preview"
            className="h-full w-full rounded-sm border border-border bg-card"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
