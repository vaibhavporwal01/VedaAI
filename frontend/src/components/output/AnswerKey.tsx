import type { PaperSection } from "@/types";

interface AnswerKeyProps {
  sections: PaperSection[];
}

export function AnswerKey({ sections }: AnswerKeyProps) {
  const answers = sections.flatMap((section) => section.questions.map((question) => question.answer));

  return (
    <section className="mt-12">
      <h3 className="text-base font-bold text-ink desktop:text-xl">Answer Key:</h3>
      <ol className="mt-4 list-decimal space-y-4 pl-5 text-sm leading-7 text-ink desktop:text-base">
        {answers.map((answer, index) => (
          <li key={`${index}-${answer}`}>{answer}</li>
        ))}
      </ol>
    </section>
  );
}
