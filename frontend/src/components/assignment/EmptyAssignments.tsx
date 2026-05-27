import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

function EmptyIllustration() {
  return (
    <svg className="h-[260px] w-[320px] max-w-full desktop:h-[300px] desktop:w-[360px]" viewBox="0 0 360 300" role="img" aria-label="No assignments illustration">
      <circle cx="175" cy="145" r="105" fill="#FFFFFF" opacity="0.8" />
      <path d="M95 120c42-14 35-61 72-76" fill="none" stroke="#303030" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="89" cy="116" rx="24" ry="13" fill="none" stroke="#303030" strokeWidth="4" />
      <rect x="130" y="78" width="112" height="144" rx="18" fill="#FFFFFF" />
      <rect x="152" y="108" width="72" height="12" rx="6" fill="#303030" />
      <rect x="152" y="150" width="78" height="10" rx="5" fill="#E5E7EB" />
      <rect x="152" y="184" width="60" height="10" rx="5" fill="#E5E7EB" />
      <rect x="257" y="58" width="74" height="42" rx="5" fill="#FFFFFF" />
      <circle cx="276" cy="79" r="7" fill="#A9A9A9" />
      <rect x="292" y="73" width="27" height="11" rx="5.5" fill="#E5E7EB" />
      <circle cx="225" cy="162" r="61" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="12" />
      <path d="M204 140l42 42M246 140l-42 42" stroke="#E8452A" strokeWidth="18" strokeLinecap="round" />
      <path d="M270 207l52 52" stroke="#E5E7EB" strokeWidth="22" strokeLinecap="round" />
      <path d="M109 236c5-15 5-15 18-21-13-6-13-6-18-21-5 15-5 15-18 21 13 6 13 6 18 21z" fill="none" stroke="#6B7280" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="320" cy="170" r="7" fill="#6B7280" />
    </svg>
  );
}

export function EmptyAssignments() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-170px)] max-w-[760px] flex-col items-center justify-center px-5 pt-10 text-center desktop:min-h-[calc(100vh-92px)] desktop:pt-0">
      <EmptyIllustration />
      <h1 className="mt-8 text-3xl font-bold text-ink desktop:text-xl">No assignments yet</h1>
      <p className="mt-3 max-w-[560px] text-xl leading-[1.35] text-mutedMcp desktop:text-base">
        Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define
        marking criteria, and let AI assist with grading.
      </p>
      <Link href="/assignments/create" className="mt-9">
        <Button className="h-[56px] px-8 text-xl font-bold desktop:h-[46px] desktop:text-sm" icon={<Plus size={28} className="desktop:size-5" />}>
          Create Your First Assignment
        </Button>
      </Link>
    </section>
  );
}
