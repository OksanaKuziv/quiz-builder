"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { Quiz } from "@/types/quiz";
import Link from "next/link";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getQuizzes();
        setQuizzes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };

    void loadQuizzes();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await api.deleteQuiz(id);
      setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
      setConfirmDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete quiz");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">All Quizzes</h1>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      {quizzes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-primary text-lg mb-6">No quizzes found</p>
          <Link
            href="/create"
            className="bg-primary text-text hover:bg-primary-light px-6 py-4 rounded-md text-sm font-medium transition-colors"
          >
            Create New Quiz
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-bg-card border border-bg-border rounded-lg p-6 hover:border-primary transition-all"
            >
              <h2 className="text-xl font-semibold text-text mb-2">
                {quiz.title}
              </h2>
              <p className="text-sm text-text-muted mb-4">
                {quiz.questions.length} question
                {quiz.questions.length !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-text-placeholder mb-4">
                Created: {new Date(quiz.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <Link
                  href={`/quizzes/${quiz.id}`}
                  className="flex-1 bg-primary text-text hover:bg-primary-light px-4 py-2 rounded-md text-sm font-medium text-center transition-colors"
                >
                  View
                </Link>
                <button
                  onClick={() => setConfirmDelete(quiz.id)}
                  disabled={deletingId === quiz.id}
                  className="bg-error text-text hover:bg-error/80 border border-transparent hover:border-text px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 transition-all cursor-pointer"
                >
                  {deletingId === quiz.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-bg-card border border-bg-border rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-text mb-4 cursor-default">
              Delete Quiz?
            </h3>
            <p className="text-text-muted mb-6 cursor-default">
              Are you sure you want to delete this quiz? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-primary text-text hover:bg-primary-light px-4 py-2 rounded-md text-sm font-medium text-center transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="bg-error text-text hover:bg-error/80 border border-transparent hover:border-text px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
