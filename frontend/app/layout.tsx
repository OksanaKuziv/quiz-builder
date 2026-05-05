import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quiz Builder",
  description: "Create and manage quizzes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-bg">
        <nav className="bg-bg-card shadow-sm border-b border-bg-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 gap-2">
              <div className="flex flex-row items-center min-w-0">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-base sm:text-xl font-bold text-primary-light whitespace-nowrap"
                >
                  <Image
                    src="/logo.png"
                    alt="Quiz Builder Logo"
                    width={52}
                    height={52}
                    className="w-10 h-10 sm:w-13 sm:h-13"
                  />
                  Quiz Builder
                </Link>
              </div>
              <div className="flex items-center gap-2 sm:space-x-4">
                <Link
                  href="/quizzes"
                  className="text-text-muted hover:text-primary-light px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                >
                  All Quizzes
                </Link>
                <Link
                  href="/create"
                  className="bg-primary text-text hover:bg-primary-light px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Create Quiz
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
