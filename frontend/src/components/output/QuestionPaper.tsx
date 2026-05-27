import { AnswerKey } from "./AnswerKey";
import type { QuestionPaper as QuestionPaperType } from "@/types";

interface QuestionPaperProps {
  paper: QuestionPaperType;
}

export function QuestionPaper({ paper }: QuestionPaperProps) {
  return (
    <article className="question-paper rounded-[20px] bg-white px-5 py-8 shadow-card desktop:rounded-[24px] desktop:px-12 desktop:py-10">
      <header className="text-center">
        <h1 className="text-[18px] font-bold leading-tight text-ink desktop:text-2xl">{paper.schoolName}</h1>
        <p className="mt-3 text-base font-bold text-ink desktop:text-xl">Subject: {paper.subject}</p>
        <p className="mt-1 text-base font-bold text-ink desktop:text-xl">Class: {paper.grade.replace("Grade ", "")}</p>
      </header>

      <div className="mt-8 grid gap-3 text-sm font-bold text-ink desktop:grid-cols-2 desktop:text-base">
        <p>Time Allowed: {paper.timeAllowed}</p>
        <p className="desktop:text-right">Maximum Marks: {paper.maxMarks}</p>
      </div>

      <p className="mt-8 text-sm font-bold leading-6 text-ink desktop:text-base">All questions are compulsory unless stated otherwise.</p>

      <div className="mt-8 space-y-1 text-sm font-bold text-ink desktop:text-base">
        <p>Name: ____________________</p>
        <p>Roll Number: ______________</p>
        <p>Class: {paper.grade.replace("Grade ", "")} Section: __________</p>
      </div>

      {paper.sections.map((section) => (
        <section key={section.title} className="mt-10">
          <h2 className="text-center text-lg font-bold text-ink desktop:text-xl">{section.title}</h2>
          <div className="mt-8">
            <h3 className="text-sm font-bold text-ink desktop:text-base">{section.heading}</h3>
            <p className="text-sm italic leading-6 text-ink desktop:text-base">{section.instruction}</p>
          </div>
          <ol className="mt-8 list-decimal space-y-4 pl-5 text-sm leading-7 text-ink desktop:text-base">
            {section.questions.map((question, index) => (
              <li key={`${section.title}-${index}`}>
                [{question.difficulty}] {question.text} [{question.marks} Marks]
              </li>
            ))}
          </ol>
        </section>
      ))}

      <p className="mt-8 text-sm font-bold text-ink desktop:text-base">End of Question Paper</p>
      <AnswerKey sections={paper.sections} />
    </article>
  );
}
