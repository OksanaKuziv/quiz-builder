"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  useFieldArray,
  UseFormRegister,
  Control,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/services/api";
import ErrorMessage from "@/components/ErrorMessage";
import Link from "next/link";

const questionSchema = z.object({
  type: z.enum(["boolean", "input", "checkbox"]),
  text: z.string().min(1, "Question text is required"),
  options: z.array(z.string()).optional(),
});

const quizSchema = z.object({
  title: z.string().min(1, "Title is required"),
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
});

type QuizFormData = z.infer<typeof quizSchema>;

export default function CreateQuizPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      questions: [{ type: "boolean", text: "", options: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = async (data: QuizFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const cleanedData = {
        ...data,
        questions: data.questions.map((q) => ({
          ...q,
          options:
            q.type === "checkbox" && q.options
              ? q.options.filter((opt) => opt.trim() !== "")
              : undefined,
        })),
      };

      await api.createQuiz(cleanedData);
      router.push("/quizzes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/quizzes"
          className="text-primary-light hover:text-accent mb-2 inline-block"
        >
          ← Back to quizzes
        </Link>
        <h1 className="text-3xl font-bold text-text">Create New Quiz</h1>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-bg-card border border-bg-border rounded-lg p-6">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-text mb-2"
          >
            Quiz Title *
          </label>
          <input
            id="title"
            type="text"
            {...register("title")}
            className="w-full px-3 py-1.5 border border-bg-border rounded-md focus:ring-primary focus:border-primary bg-bg text-text"
            placeholder="Enter quiz title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-error">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-text">Questions</h2>
            <button
              type="button"
              onClick={() => append({ type: "boolean", text: "", options: [] })}
              className="bg-primary text-text hover:bg-primary-light px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Question
            </button>
          </div>

          {fields.map((field, index) => (
            <QuestionField
              key={field.id}
              index={index}
              register={register}
              control={control}
              watch={watch}
              remove={remove}
              errors={errors}
              canRemove={fields.length > 1}
            />
          ))}

          {errors.questions && (
            <p className="text-sm text-error">{errors.questions.message}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-text hover:bg-primary-light px-6 py-2 rounded-md font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Quiz"}
          </button>
          <Link
            href="/quizzes"
            className="bg-secondary text-text hover:bg-secondary/80 px-6 py-2 rounded-md font-medium inline-block"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

interface QuestionFieldProps {
  index: number;
  register: UseFormRegister<QuizFormData>;
  control: Control<QuizFormData>;
  watch: UseFormWatch<QuizFormData>;
  remove: (index: number) => void;
  errors: FieldErrors<QuizFormData>;
  canRemove: boolean;
}

function QuestionField({
  index,
  register,
  control,
  watch,
  remove,
  errors,
  canRemove,
}: QuestionFieldProps) {
  const questionType = watch(`questions.${index}.type`);
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: `questions.${index}.options` as any,
  });

  return (
    <div className="bg-bg-card border border-primary/30 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-text">
          Question {index + 1}
        </h3>
        {canRemove && (
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-error hover:text-error/80 text-sm font-medium"
          >
            Remove
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Question Type *
          </label>
          <select
            {...register(`questions.${index}.type`)}
            className="w-full px-3 py-2 border border-bg-border rounded-md focus:ring-primary focus:border-primary text-text bg-bg"
          >
            <option value="boolean">True or False</option>
            <option value="input">Text Input</option>
            <option value="checkbox">Multiple Choice</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Question Text *
          </label>
          <textarea
            {...register(`questions.${index}.text`)}
            className="w-full px-3 py-2 border border-bg-border rounded-md focus:ring-primary focus:border-primary bg-bg text-text"
            placeholder="Enter question text"
            rows={2}
          />
          {errors.questions?.[index]?.text && (
            <p className="mt-1 text-sm text-error">
              {errors.questions[index].text.message}
            </p>
          )}
        </div>

        {questionType === "checkbox" && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-text-muted">
                Options
              </label>
              <button
                type="button"
                onClick={() => appendOption("")}
                className="text-primary-light hover:text-accent text-sm font-medium"
              >
                + Add Option
              </button>
            </div>
            <div className="space-y-2">
              {optionFields.map((field, optIndex) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    type="text"
                    {...register(`questions.${index}.options.${optIndex}`)}
                    className="flex-1 px-3 py-2 border border-bg-border rounded-md focus:ring-primary focus:border-primary bg-bg text-text"
                    placeholder={`Option ${optIndex + 1}`}
                  />
                  {optionFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(optIndex)}
                      className="text-error hover:text-error/80 px-3"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {optionFields.length === 0 && (
                <button
                  type="button"
                  onClick={() => appendOption("")}
                  className="w-full px-3 py-2 border-2 border-dashed border-bg-border rounded-md text-text-placeholder hover:border-primary hover:text-text-muted"
                >
                  Add first option
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
