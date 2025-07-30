import React from 'react';
import { Lesson } from '../types';

interface LessonGridProps {
  lessons: Lesson[];
  onStartQuiz: (lesson: Lesson) => void;
}

export const LessonGrid: React.FC<LessonGridProps> = ({ lessons, onStartQuiz }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Let's Learn!</h2>
        <p className="text-slate-500 text-lg">Pick a quiz to test your knowledge.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center cursor-pointer transform hover:-translate-y-2 transition-transform duration-300"
            onClick={() => onStartQuiz(lesson)}
          >
            <div className={`text-6xl ${lesson.color} rounded-full w-24 h-24 flex items-center justify-center mb-4`}>
              <span className="transform -translate-y-1">{lesson.icon}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-4">{lesson.title}</h3>
            <button className={`${lesson.color} text-white font-bold py-2 px-6 rounded-full shadow-lg hover:opacity-90 transition-opacity`}>
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
