
import React, { useState } from 'react';
import { Lesson } from './types';
import { lessons } from './data/lessons';
import { Header } from './components/Header';
import { LessonGrid } from './components/LessonGrid';
import { QuizView } from './components/QuizView';

type GameState = 'menu' | 'quiz' | 'summary';

const QuizSummary: React.FC<{ score: number; total: number; onRestart: () => void; onBackToMenu: () => void; lessonColor: string; }> = ({ score, total, onRestart, onBackToMenu, lessonColor }) => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  let feedback = { emoji: '🎉', message: "Great Job!" };
  if (percentage < 50) {
    feedback = { emoji: '🤔', message: "Keep Practicing!" };
  } else if (percentage < 80) {
    feedback = { emoji: '👍', message: "Good Effort!" };
  }

  return (
    <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto animate-fade-in">
        <div className="text-7xl mb-4 animate-bounce">{feedback.emoji}</div>
        <h2 className="text-3xl font-bold mb-2">{feedback.message}</h2>
        <p className="text-slate-600 text-xl mb-6">You scored</p>
        <div className="text-6xl font-bold mb-8">
            {score} <span className="text-3xl text-slate-400">/ {total}</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
                onClick={onRestart}
                className={`w-full ${lessonColor} text-white font-bold py-3 px-6 rounded-full shadow-lg hover:opacity-90 transition-transform hover:-translate-y-1`}
            >
                Try Again
            </button>
            <button
                onClick={onBackToMenu}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-6 rounded-full transition-colors"
            >
                Back to Lessons
            </button>
        </div>
    </div>
  );
};


function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [finalScore, setFinalScore] = useState({ score: 0, total: 0 });

  const handleStartQuiz = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setGameState('quiz');
  };

  const handleQuizComplete = (score: number, total: number) => {
    setFinalScore({ score, total });
    setGameState('summary');
  };
  
  const handleBackToMenu = () => {
    setActiveLesson(null);
    setGameState('menu');
  };

  const handleRestartQuiz = () => {
    setGameState('quiz'); // activeLesson is still set
  }

  const renderContent = () => {
    switch (gameState) {
      case 'quiz':
        return activeLesson && <QuizView lesson={activeLesson} onComplete={handleQuizComplete} onBack={handleBackToMenu} />;
      case 'summary':
        return activeLesson && <QuizSummary score={finalScore.score} total={finalScore.total} onRestart={handleRestartQuiz} onBackToMenu={handleBackToMenu} lessonColor={activeLesson.color} />;
      case 'menu':
      default:
        return <LessonGrid lessons={lessons} onStartQuiz={handleStartQuiz} />;
    }
  }

  return (
    <div className="min-h-screen text-slate-800">
      <style>{`
        .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-bounce { animation: bounce 1s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); } 50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); } }
      `}</style>
      <Header />
      <main className="container mx-auto px-4 py-24 flex items-center justify-center" style={{minHeight: 'calc(100vh - 80px)'}}>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;