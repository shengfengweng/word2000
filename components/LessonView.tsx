
import React from 'react';
import { Lesson, Word } from '../types';

interface LessonViewProps {
  lesson: Lesson;
  onBack: () => void;
}

const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Sorry, your browser doesn't support text-to-speech.");
  }
};

const WordCard: React.FC<{ word: Word }> = ({ word }) => (
    <div className="bg-white rounded-2xl shadow-lg p-4 group flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:scale-105">
        <div className="text-7xl mb-3 h-20 flex items-center">{word.image || '📖'}</div>
        <h3 className="text-2xl font-bold text-slate-800">{word.english}</h3>
        <p className="text-slate-500 mt-1 font-['Noto_Sans_TC'] text-lg">{word.chinese}</p>
        <div className="flex-grow"></div>
        <div className="mt-4 flex items-center justify-center space-x-4 w-full">
            <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{word.pos}</span>
            <button
                onClick={() => speak(word.english)}
                className="bg-sky-500 hover:bg-sky-600 text-white rounded-full p-3 shadow-lg transition-all"
                aria-label={`Listen to ${word.english}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 8.464a5 5 0 000 7.072m2.828 9.9A9 9 0 0012 3c-2.392 0-4.597.938-6.142 2.572" />
                </svg>
            </button>
        </div>
    </div>
);


export const LessonView: React.FC<LessonViewProps> = ({ lesson, onBack }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="bg-white hover:bg-slate-100 text-slate-600 font-bold py-2 px-4 rounded-full shadow-md transition-colors"
        >
          &larr; Back to Lessons
        </button>
        <div className="flex items-center space-x-3">
            <span className="text-4xl">{lesson.icon}</span>
            <h2 className="text-3xl font-bold text-slate-800">{lesson.title}</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {lesson.words.map((word, index) => (
          <WordCard key={`${word.english}-${index}`} word={word} />
        ))}
      </div>
    </div>
  );
};
