import { API_BASE_URL } from "@/config/apiConfig";
import { CreateQuizDto, Quiz } from "@/types/quiz";

export const api = {
  async getQuizzes(): Promise<Quiz[]> {
    const response = await fetch(`${API_BASE_URL}/quizzes`);
    if (!response.ok) {
      throw new Error("Failed to fetch quizzes");
    }
    return response.json();
  },

  async getQuiz(id: string): Promise<Quiz> {
    const response = await fetch(`${API_BASE_URL}/quizzes/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Quiz not found");
      }
      throw new Error("Failed to fetch quiz");
    }
    return response.json();
  },

  async createQuiz(data: CreateQuizDto): Promise<Quiz> {
    const response = await fetch(`${API_BASE_URL}/quizzes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create quiz");
    }
    return response.json();
  },

  async deleteQuiz(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Quiz not found");
      }
      throw new Error("Failed to delete quiz");
    }
  },
};
