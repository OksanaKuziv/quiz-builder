"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/services/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { Quiz } from "@/types/quiz";

export default function QuizDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getQuiz(id);
        setQuiz(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    void loadQuiz();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div>
        <ErrorMessage message={error} />
        <div className="mt-4">
          <Link
            href="/quizzes"
            className="text-primary-light hover:text-accent transition-colors"
          >
            ← Back to quizzes
          </Link>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/quizzes"
          className="text-primary-light hover:text-accent mb-4 inline-block transition-colors"
        >
          ← Back to quizzes
        </Link>
        <h1 className="text-3xl font-bold text-text mb-2">{quiz.title}</h1>
        <p className="text-sm text-text-muted">
          Created: {new Date(quiz.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((question, index) => (
          <div
            key={question.id}
            className="bg-bg-card border border-bg-border rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">
                Question {index + 1}
              </h3>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-accent">
                {question.type}
              </span>
            </div>
            <p className="text-text-muted mb-4">{question.text}</p>

            {question.type === "boolean" && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    disabled
                    className="h-4 w-4 accent-primary border-bg-border"
                  />
                  <label className="ml-2 text-text-muted">True</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    disabled
                    className="h-4 w-4 accent-primary border-bg-border"
                  />
                  <label className="ml-2 text-text-muted">False</label>
                </div>
              </div>
            )}

            {question.type === "input" && (
              <input
                type="text"
                disabled
                placeholder="Text answer"
                className="w-full px-3 py-2 border border-secondary rounded-md bg-bg-border text-text-placeholder"
              />
            )}

            {question.type === "checkbox" && question.options && (
              <div className="space-y-2">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center">
                    <input
                      type="checkbox"
                      disabled
                      className="h-4 w-4 accent-primary border-bg-border rounded"
                    />
                    <label className="ml-2 text-text-muted">{option}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
