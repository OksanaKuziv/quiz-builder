import Link from "next/link";

export default function HomePage() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-text mb-4">
        Welcome to Quiz Builder
      </h1>
      <p className="text-xl text-primary mb-8">
        Create, manage, and view quizzes with ease
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/quizzes"
          className="bg-primary text-text hover:bg-primary-light px-6 py-3 rounded-md text-lg font-medium transition-colors whitespace-nowrap w-full sm:w-auto"
        >
          View All Quizzes
        </Link>
        <Link
          href="/create"
          className="bg-secondary text-text hover:bg-secondary/80 px-6 py-3 rounded-md text-lg font-medium transition-colors whitespace-nowrap w-full sm:w-auto"
        >
          Create New Quiz
        </Link>
      </div>
    </div>
  );
}
