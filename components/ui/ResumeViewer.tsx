"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  fileName = "Sourav-Resume.pdf",
}: ResumeViewerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[88vh] max-w-5xl border-border/70 bg-background/95 p-0 backdrop-blur">
        <DialogHeader className="border-b border-border/70 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4 pr-8">
            <div>
              <DialogTitle>Resume</DialogTitle>
              <DialogDescription>Preview and download my  resume.</DialogDescription>
            </div>
            <a href={resumeUrl} download={fileName} target="_blank" rel="noreferrer">
              <Button type="button" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </a>
          </div>
        </DialogHeader>

        <div className="h-[calc(88vh-84px)] w-full p-4 pt-3 sm:p-5 sm:pt-4">
          <iframe
            src={resumeUrl}
            title="Resume Preview"
            className="h-full w-full rounded-md border border-border/70 bg-card"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
