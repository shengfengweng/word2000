import { Lesson, QuizQuestion, Word, QuestionType } from '../types';

// Fisher-Yates shuffle algorithm to randomize array elements
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Generates a set of quiz questions for a given lesson
export const generateQuiz = (lesson: Lesson, numQuestions: number = 10, numOptions: number = 5): QuizQuestion[] => {
  const allWordsWithImages = lesson.words.filter(w => !!w.image);

  // Ensure we don't try to create a quiz if there aren't enough words for options
  if (lesson.words.length < numOptions) {
    console.warn("Not enough words in the lesson to generate a quiz with the desired number of options.");
    return [];
  }

  // Shuffle the words and take the desired number of questions for the quiz
  const quizWords = shuffleArray(lesson.words).slice(0, numQuestions);

  const questions = quizWords.map((correctWord) => {
    // Define possible types for THIS word
    const possibleTypes: QuestionType[] = [
      QuestionType.CHINESE_TO_ENGLISH,
      QuestionType.ENGLISH_TO_CHINESE,
      QuestionType.LISTEN_TO_ENGLISH,
    ];

    // Image questions are only possible if the word has an image AND there are enough other words with images to be distractors.
    if (correctWord.image && allWordsWithImages.length >= numOptions) {
      possibleTypes.push(QuestionType.IMAGE_TO_ENGLISH);
    }
    
    // Randomly select a type from the possible ones
    const questionType = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
    
    let distractorsPool: Word[];
    
    // For image questions, distractors must also have images to be fair.
    if (questionType === QuestionType.IMAGE_TO_ENGLISH) {
        distractorsPool = allWordsWithImages.filter(word => word.english !== correctWord.english);
    } else {
        distractorsPool = lesson.words.filter(word => word.english !== correctWord.english);
    }
    
    const shuffledDistractors = shuffleArray(distractorsPool);
    const distractors = shuffledDistractors.slice(0, numOptions - 1);

    const options = shuffleArray([
      correctWord,
      ...distractors
    ]);

    return {
      questionWord: correctWord,
      options: options,
      type: questionType,
    };
  });

  return shuffleArray(questions); // Shuffle the order of questions as well
};