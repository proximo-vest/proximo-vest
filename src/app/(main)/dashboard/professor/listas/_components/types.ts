// src/app/(main)/dashboard/professor/listas/_components/types.ts

export type SubjectOption = {
  id: number;
  name: string;
};

export type DifficultyOption = {
  value: string;
  label: string;
};

export type BoardOption = {
  id: number;
  name: string;
};

export type YearOption = {
  boardId: number; // <- novo
  year: number;
};

export type QuestionDTO = {
  id: number;
  numberLabel: string;
  difficulty: string | null;
  isDiscursive: boolean;
  subjects: { id: number; name: string }[];
  preview: string;
  body: string;
  options?: {
    label: string;
    text: string;
  }[];
};

export type SelectedQuestion = QuestionDTO;
export type InitialQuestion = QuestionDTO;

export type TeacherListInitialData = {
  id: string;
  name: string;
  description: string | null;
  teacherName: string;
  questions: InitialQuestion[];
};
