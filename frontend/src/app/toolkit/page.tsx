"use client";

import { FormEvent, useState } from "react";
import { ClipboardCheck, FileText, Wand2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { MobileTitle } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/services/api";

const tools = ["Question Paper Outline", "Rubric", "Worksheet", "Feedback Notes"];

export default function ToolkitPage() {
  const [tool, setTool] = useState(tools[0]);
  const [topic, setTopic] = useState("");
  const [draft, setDraft] = useState<string[]>([
    "Question Paper Outline: Topic draft",
    "Objective: Check concept clarity, application, and written explanation."
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [limitMessage, setLimitMessage] = useState<string | undefined>();

  const createDraft = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const focus = topic.trim() || "selected topic";
    setLimitMessage(undefined);
    setIsGenerating(true);

    try {
      const result = await api.generateToolkitDraft(tool, focus);
      setDraft(result.lines);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to generate draft";
      if (/limit|quota|api key|429/i.test(message)) {
        setLimitMessage(message);
      } else {
        setDraft([
          `${tool}: ${focus}`,
          `Objective: Check understanding of ${focus}.`,
          "Structure: Warm-up, main task, review, and answer key.",
          "Review: Adjust difficulty before assigning."
        ]);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppShell breadcrumb="Teacher's Toolkit" backHref="/">
      <MobileTitle title="Toolkit" backHref="/" />
      <section className="mx-auto w-[calc(100vw-32px)] max-w-[373px] pt-6 desktop:w-auto desktop:max-w-[1280px] desktop:pt-9">
        <PageHeader title="Teacher's Toolkit" description="Fast classroom drafts and reusable teaching material." icon={FileText} />

        <div className="grid gap-4 desktop:grid-cols-[420px_1fr]">
          <form onSubmit={createDraft} className="rounded-[28px] bg-white p-5 shadow-card desktop:p-6">
            <h1 className="text-xl font-bold text-ink">Create Draft</h1>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold text-ink">Tool</span>
              <select
                className="focus-ring h-11 w-full rounded-full border border-line bg-white px-4 text-sm font-bold text-ink"
                value={tool}
                onChange={(event) => setTool(event.target.value)}
              >
                {tools.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-bold text-ink">Topic</span>
              <Input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="e.g. Trees in DSA" />
            </label>
            <Button className="mt-5 w-full" disabled={isGenerating} icon={<Wand2 size={20} />} type="submit">
              {isGenerating ? "Generating" : "Generate Draft"}
            </Button>
          </form>

          <div className="rounded-[28px] bg-white p-5 shadow-card desktop:p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-primary text-white">
                <FileText size={20} />
              </span>
              <div>
                <p className="text-sm font-bold text-disabled">Current Draft</p>
                <h2 className="text-xl font-bold text-ink">{tool}</h2>
              </div>
            </div>
            {isGenerating ? (
              <div className="mt-6 rounded-[18px] bg-soft p-5">
                <div className="flex items-center gap-3">
                  <span className="size-5 animate-spin rounded-full border-2 border-disabled border-t-primary" />
                  <p className="text-sm font-bold text-ink">Generating classroom draft...</p>
                </div>
                <div className="mt-5 space-y-3">
                  <span className="block h-4 w-3/4 rounded-full bg-white" />
                  <span className="block h-4 w-full rounded-full bg-white" />
                  <span className="block h-4 w-2/3 rounded-full bg-white" />
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {draft.map((line) => (
                  <div key={line} className="flex gap-3 rounded-[18px] bg-soft p-4 text-sm font-medium leading-6 text-ink">
                  <ClipboardCheck size={18} className="mt-1 shrink-0 text-success" />
                  <p>{line}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      {limitMessage ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-[420px] rounded-[24px] bg-white p-6 shadow-realistic">
            <h2 className="text-xl font-bold text-ink">API Limit Reached</h2>
            <p className="mt-3 text-sm leading-6 text-mutedMcp">{limitMessage}</p>
            <Button className="mt-5" type="button" onClick={() => setLimitMessage(undefined)}>
              Got it
            </Button>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
