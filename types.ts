export interface Word {
  english: string;
  pos: string;
  chinese: string;
  image?: string; // e.g., an emoji or a URL to an image
}

export interface Lesson {
  id: string;
  title: string;
  icon: string; // emoji for the lesson
  color: string; // tailwind color class
  words: Word[];
}

export enum QuestionType {
  CHINESE_TO_ENGLISH,
  ENGLISH_TO_CHINESE,
  IMAGE_TO_ENGLISH,
  LISTEN_TO_ENGLISH,
}

export interface QuizQuestion {
  questionWord: Word;
  options: Word[];
  type: QuestionType;
}