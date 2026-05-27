"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mic, MoveLeft, MoveRight, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AppShell } from "@/components/layout/AppShell";
import { MobileTitle } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DatePicker } from "@/components/form/DatePicker";
import { FileUpload } from "@/components/form/FileUpload";
import { QuestionTypeRow } from "@/components/form/QuestionTypeRow";
import { DEFAULT_ASSIGNMENT_CONTEXT, DEFAULT_QUESTION_TYPES } from "@/lib/constants";
import { assignmentFormSchema, type AssignmentFormValues } from "@/lib/validations";
import { useProfileStore } from "@/features/profile/store";
import { api } from "@/services/api";
import type { QuestionTypeConfig } from "@/types";

export default function CreateAssignmentPage() {
  const router = useRouter();
  const schoolName = useProfileStore((state) => state.schoolName);
  const [fileName, setFileName] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<string | undefined>();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: DEFAULT_ASSIGNMENT_CONTEXT.title,
      subject: DEFAULT_ASSIGNMENT_CONTEXT.subject,
      grade: DEFAULT_ASSIGNMENT_CONTEXT.grade,
      topic: DEFAULT_ASSIGNMENT_CONTEXT.topic,
      timeAllowed: DEFAULT_ASSIGNMENT_CONTEXT.timeAllowed,
      dueDate: "",
      instructions: "",
      questionTypes: DEFAULT_QUESTION_TYPES
    }
  });

  const questionTypes = watch("questionTypes");
  const dueDate = watch("dueDate");
  const fileField = register("file");
  const totals = useMemo(
    () =>
      questionTypes.reduce(
        (acc, row) => ({
          questions: acc.questions + Number(row.count || 0),
          marks: acc.marks + Number(row.count || 0) * Number(row.marks || 0)
        }),
        { questions: 0, marks: 0 }
      ),
    [questionTypes]
  );

  const updateRow = (index: number, row: QuestionTypeConfig) => {
    const next = [...questionTypes];
    next[index] = row;
    setValue("questionTypes", next, { shouldValidate: true, shouldDirty: true });
  };

  const removeRow = (index: number) => {
    setValue(
      "questionTypes",
      questionTypes.filter((_, rowIndex) => rowIndex !== index),
      { shouldValidate: true, shouldDirty: true }
    );
  };

  const addRow = () => {
    setValue(
      "questionTypes",
      [...questionTypes, { type: "Long Answer Questions", count: 1, marks: 5 }],
      { shouldValidate: true, shouldDirty: true }
    );
  };

  const onSubmit = async (values: AssignmentFormValues) => {
    setSubmitError(undefined);
    const data = new FormData();
    data.append("title", values.title);
    data.append("subject", values.subject);
    data.append("grade", values.grade);
    data.append("topic", values.topic);
    data.append("timeAllowed", values.timeAllowed);
    data.append("schoolName", schoolName);
    data.append("dueDate", values.dueDate);
    data.append("instructions", values.instructions ?? "");
    data.append("questionTypes", JSON.stringify(values.questionTypes));
    const file = values.file?.[0];
    if (file) {
      data.append("file", file);
    }

    try {
      const result = await api.createAssignment(data);
      router.push(`/assignments/${result.id}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to create assignment");
    }
  };

  return (
    <AppShell breadcrumb="Assignment" backHref="/assignments">
      <MobileTitle title="Create Assignment" />
      <section className="mx-auto max-w-[373px] pt-7 desktop:max-w-[1280px] desktop:pt-9">
        <div className="mb-9 hidden items-start gap-4 desktop:flex">
          <span className="mt-2 grid size-10 place-items-center rounded-xl bg-white text-ink shadow-soft">
            <Plus size={20} />
          </span>
          <div>
            <h1 className="text-xl font-bold text-ink">Create Assignment</h1>
            <p className="mt-1 text-sm text-disabled">Set up a new assignment for your students</p>
          </div>
        </div>

        <div className="mx-auto mb-8 flex max-w-[815px] items-center gap-3">
          <span className="h-1 flex-1 rounded-full bg-mutedMcp" />
          <span className="h-1 flex-1 rounded-full bg-[#DADADA]" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-[28px] bg-soft p-6 shadow-card desktop:mx-auto desktop:w-[810px] desktop:bg-white desktop:p-8">
            <div>
              <h2 className="text-[28px] font-bold leading-tight text-ink desktop:text-xl">Assignment Details</h2>
              <p className="mt-2 text-xl text-mutedMcp desktop:text-sm">Basic information about your assignment</p>
            </div>

            <div className="mt-8 grid gap-4 desktop:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-base font-bold text-ink desktop:text-sm">Assignment Name</span>
                <Input placeholder="e.g. DSA practice paper" error={errors.title?.message} {...register("title")} />
              </label>
              <label className="block">
                <span className="mb-2 block text-base font-bold text-ink desktop:text-sm">Subject</span>
                <Input placeholder="e.g. Computer Science" error={errors.subject?.message} {...register("subject")} />
              </label>
              <label className="block">
                <span className="mb-2 block text-base font-bold text-ink desktop:text-sm">Class / Grade</span>
                <Input placeholder="e.g. Grade 8" error={errors.grade?.message} {...register("grade")} />
              </label>
              <label className="block">
                <span className="mb-2 block text-base font-bold text-ink desktop:text-sm">Main Topic</span>
                <Input placeholder="e.g. Data Structures and Algorithms" error={errors.topic?.message} {...register("topic")} />
              </label>
              <label className="block desktop:col-span-2">
                <span className="mb-2 block text-base font-bold text-ink desktop:text-sm">Time Allowed</span>
                <Input placeholder="e.g. 45 minutes" error={errors.timeAllowed?.message} {...register("timeAllowed")} />
              </label>
            </div>

            <div className="mt-10 desktop:mt-9">
              <FileUpload inputProps={fileField} fileName={fileName} error={errors.file?.message} onFileName={setFileName} />
            </div>

            <div className="mt-6">
              <DatePicker value={dueDate} error={errors.dueDate?.message} onChange={(value) => setValue("dueDate", value, { shouldValidate: true })} />
            </div>

            <div className="mt-8">
              <div className="mb-4 grid-cols-[443px_16px_100px_100px] gap-x-4 text-base font-bold text-ink desktop:grid">
                <span>Question Type</span>
                <span />
                <span className="text-center">No. of Questions</span>
                <span className="text-center">Marks</span>
              </div>
              <div className="space-y-4 desktop:space-y-4">
                {questionTypes.map((row, index) => (
                  <QuestionTypeRow key={`${row.type}-${index}`} row={row} index={index} onChange={updateRow} onRemove={removeRow} />
                ))}
              </div>
              {errors.questionTypes?.message ? <p className="mt-2 text-sm font-medium text-brand">{errors.questionTypes.message}</p> : null}

              <div className="mt-5 flex flex-col gap-6 desktop:flex-row desktop:items-start desktop:justify-between">
                <button className="focus-ring flex w-fit items-center gap-3 rounded-full text-sm font-bold text-ink hover:text-brand" type="button" onClick={addRow}>
                  <span className="grid size-9 place-items-center rounded-full bg-primary text-white">
                    <Plus size={22} />
                  </span>
                  Add Question Type
                </button>
                <div className="space-y-2 text-right text-xl font-medium text-ink desktop:text-sm">
                  <p>Total Questions : {totals.questions}</p>
                  <p>Total Marks : {totals.marks}</p>
                </div>
              </div>
            </div>

            <label className="mt-8 block">
              <span className="mb-2 block text-base font-bold text-ink">Additional Information (For better output)</span>
              <div className="relative">
                <textarea
                  {...register("instructions")}
                  className="focus-ring min-h-[102px] w-full resize-none rounded-[18px] border border-dashed border-[#DADADA] bg-white p-4 pr-14 text-sm text-ink placeholder:text-disabled hover:border-primary focus-visible:border-primary"
                  placeholder="e.g. Include arrays, stacks, queues, complexity analysis, and moderate difficulty."
                />
                <span className="absolute bottom-4 right-4 grid size-9 place-items-center rounded-full bg-soft text-ink">
                  <Mic size={18} />
                </span>
              </div>
              {errors.instructions?.message ? <p className="mt-2 text-sm font-medium text-brand">{errors.instructions.message}</p> : null}
            </label>
          </div>

          {submitError ? <p className="mx-auto mt-5 max-w-[810px] rounded-2xl bg-white p-4 text-sm font-bold text-brand">{submitError}</p> : null}

          <div className="mx-auto mt-8 flex max-w-[373px] items-center justify-center gap-5 desktop:max-w-[810px] desktop:justify-between">
            <Button type="button" variant="secondary" onClick={() => router.push("/assignments")} icon={<MoveLeft size={20} />}>
              Previous
            </Button>
            <Button type="submit" disabled={isSubmitting} icon={<MoveRight size={20} />} className="flex-row-reverse">
              {isSubmitting ? "Creating" : "Next"}
            </Button>
          </div>
        </form>
      </section>
    </AppShell>
  );
}
