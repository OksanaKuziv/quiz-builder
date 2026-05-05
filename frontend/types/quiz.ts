export interface Question {
  id: string;
  type: "boolean" | "input" | "checkbox";
  text: string;
  options: string[] | null;
}

export interface Quiz {
  id: string;
  title: string;
  createdAt: string;
  questions: Question[];
}

export interface CreateQuestionDto {
  type: "boolean" | "input" | "checkbox";
  text: string;
  options?: string[];
}

export interface CreateQuizDto {
  title: string;
  questions: CreateQuestionDto[];
}