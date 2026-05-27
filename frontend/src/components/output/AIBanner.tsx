"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface AIBannerProps {
  teacherName: string;
  subject: string;
  grade: string;
  topic: string;
}

export function AIBanner({ teacherName, subject, grade, topic }: AIBannerProps) {
  const [downloadError, setDownloadError] = useState(false);

  const handleDownload = () => {
    try {
      window.print();
    } catch {
      setDownloadError(true);
    }
  };

  return (
    <section className="no-print rounded-[24px] bg-primary p-4 text-white shadow-card desktop:p-8">
      <div className="flex flex-col gap-5 desktop:flex-row desktop:items-start desktop:justify-between">
        <p className="max-w-[900px] text-sm font-bold leading-[1.35] desktop:text-base">
          {teacherName}, your question paper for {subject}, {grade}, focused on {topic} is ready.
        </p>
        <Button
          className="w-fit bg-white text-ink hover:bg-soft disabled:bg-white/60"
          disabled={downloadError}
          icon={<Download size={18} />}
          onClick={handleDownload}
          type="button"
        >
          {downloadError ? "Download unavailable" : "Download PDF"}
        </Button>
      </div>
      {downloadError ? <p className="mt-3 text-sm font-medium text-white">Download unavailable</p> : null}
    </section>
  );
}
