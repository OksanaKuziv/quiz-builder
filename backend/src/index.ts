import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

interface CreateQuestionDto {
  type: 'boolean' | 'input' | 'checkbox';
  text: string;
  options?: string[];
}

interface CreateQuizDto {
  title: string;
  questions: CreateQuestionDto[];
}

const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseQuizOptions = (quiz: any) => ({
  ...quiz,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: quiz.questions.map((q: any) => ({
    ...q,
    options: q.options ? JSON.parse(q.options) : null,
  })),
});

app.post(
  '/quizzes',
  asyncHandler(async (req: Request, res: Response) => {
    const { title, questions } = req.body as CreateQuizDto;

    if (!title || !questions || !Array.isArray(questions)) {
      res.status(400).json({ error: 'Invalid request body' });
      return;
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        questions: {
          create: questions.map((q) => ({
            type: q.type,
            text: q.text,
            options: q.options ? JSON.stringify(q.options) : null,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    res.status(201).json(parseQuizOptions(quiz));
  })
);

app.get(
  '/quizzes',
  asyncHandler(async (_req: Request, res: Response) => {
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(quizzes.map(parseQuizOptions));
  })
);

app.get(
  '/quizzes/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    res.json(parseQuizOptions(quiz));
  })
);

app.delete(
  '/quizzes/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.quiz.delete({
      where: { id },
    });

    res.status(204).send();
  })
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err.code === 'P2025') {
    res.status(404).json({ error: 'Quiz not found' });
    return;
  }
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT);

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
