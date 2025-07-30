import React, { useState, useEffect, useMemo } from 'react';
import { Lesson, QuizQuestion, Word, QuestionType } from '../types';
import { generateQuiz } from '../utils/quiz';
import { speak } from '../utils/speech';
import { generateExampleSentence } from '../utils/gemini';

interface QuizViewProps {
  lesson: Lesson;
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}

const ProgressBar: React.FC<{ current: number, total: number }> = ({ current, total }) => {
    const progress = total > 0 ? ((current + 1) / total) * 100 : 0;
    return (
        <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner">
            <div
                className="bg-green-500 h-4 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

const SpeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 8.464a5 5 0 000 7.072m2.828 9.9A9 9 0 0012 3c-2.392 0-4.597.938-6.142 2.572" />
    </svg>
);


export const QuizView: React.FC<QuizViewProps> = ({ lesson, onComplete, onBack }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<Word | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [exampleSentence, setExampleSentence] = useState<string | null>(null);
  const [isGeneratingExample, setIsGeneratingExample] = useState(false);

  useEffect(() => {
    // Pre-load voices if available, which helps ensure they are ready when `speak` is called.
    if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    const newQuestions = generateQuiz(lesson);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setExampleSentence(null);
    setIsGeneratingExample(false);
  }, [lesson]);
  
  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex]);

  useEffect(() => {
      if (currentQuestion && currentQuestion.type === QuestionType.LISTEN_TO_ENGLISH) {
          speak(currentQuestion.questionWord.english);
      }
  }, [currentQuestion])


  const handleOptionClick = async (option: Word) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedOption(option);
    if (option.english === currentQuestion.questionWord.english) {
      setScore(prev => prev + 1);
    }
    
    setIsGeneratingExample(true);
    setExampleSentence(null);
    try {
        const sentence = await generateExampleSentence(currentQuestion.questionWord);
        setExampleSentence(sentence);
        if (sentence) {
            speak(sentence);
        }
    } catch(error) {
        console.error("Failed to get or speak sentence", error);
        setExampleSentence(null);
    } finally {
        setIsGeneratingExample(false);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
        setExampleSentence(null);
        setIsGeneratingExample(false);
    } else {
        onComplete(score, questions.length);
    }
  }

  if (!currentQuestion) {
    return (
        <div className="text-center">
            <p className="text-xl">Loading quiz...</p>
        </div>
    );
  }

  const isCorrect = selectedOption?.english === currentQuestion.questionWord.english;

  const getQuestionInstruction = () => {
    switch (currentQuestion.type) {
      case QuestionType.CHINESE_TO_ENGLISH:
        return 'Translate this word:';
      case QuestionType.ENGLISH_TO_CHINESE:
        return 'Translate this word:';
      case QuestionType.IMAGE_TO_ENGLISH:
        return 'What is this?';
      case QuestionType.LISTEN_TO_ENGLISH:
        return 'What do you hear?';
      default:
        return 'Choose the correct option:';
    }
  };

  const renderQuestionPrompt = () => {
    switch(currentQuestion.type) {
        case QuestionType.ENGLISH_TO_CHINESE:
            return <h2 className="text-5xl md:text-6xl font-bold">{currentQuestion.questionWord.english}</h2>;
        
        case QuestionType.IMAGE_TO_ENGLISH:
            return <div className="text-8xl md:text-9xl py-4">{currentQuestion.questionWord.image}</div>;

        case QuestionType.LISTEN_TO_ENGLISH:
            return (
                <button 
                  onClick={() => speak(currentQuestion.questionWord.english)}
                  className="bg-sky-500 hover:bg-sky-600 text-white rounded-full p-6 shadow-lg transition-all active:scale-95"
                  aria-label="Play audio"
                >
                    <SpeakerIcon />
                </button>
            );
        
        case QuestionType.CHINESE_TO_ENGLISH:
        default:
            return <h2 className="text-5xl md:text-6xl font-bold font-['Noto_Sans_TC']">{currentQuestion.questionWord.chinese}</h2>
    }
  }
  
  const renderOptionContent = (option: Word) => {
      if (currentQuestion.type === QuestionType.ENGLISH_TO_CHINESE) {
          return <span className="font-['Noto_Sans_TC']">{option.chinese}</span>;
      }
      return (
        <>
            <span className="text-2xl min-w-[30px]">{option.image || '📝'}</span>
            <span>{option.english}</span>
        </>
      );
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-4 px-1">
            <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-bold p-2 -ml-2">&larr; Quit</button>
            <p className="font-bold text-slate-500">{currentIndex + 1} / {questions.length}</p>
        </div>
        <ProgressBar current={currentIndex} total={questions.length} />

        <div className="text-center my-8 md:my-10 min-h-[150px] flex flex-col justify-center items-center">
            <p className="text-lg text-slate-500 mb-4">{getQuestionInstruction()}</p>
            {renderQuestionPrompt()}
        </div>
        
        <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map(option => {
                let optionStyle = "bg-white hover:bg-slate-100 border-2 border-slate-200";
                if (isAnswered) {
                    const isThisCorrect = option.english === currentQuestion.questionWord.english;
                    const isThisSelected = option.english === selectedOption?.english;
                    
                    if(isThisCorrect) {
                       optionStyle = "bg-green-100 border-2 border-green-500 text-green-800 scale-105";
                    } else if (isThisSelected) {
                       optionStyle = "bg-red-100 border-2 border-red-500 text-red-800";
                    } else {
                       optionStyle = "bg-slate-100 border-2 border-slate-200 text-slate-500 opacity-60";
                    }
                }
                
                return (
                    <button
                        key={option.english}
                        onClick={() => handleOptionClick(option)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center space-x-4 disabled:cursor-default ${optionStyle}`}
                    >
                        {renderOptionContent(option)}
                    </button>
                )
            })}
        </div>
        
        <div className="mt-8 min-h-[160px] flex flex-col justify-end">
            {isAnswered && (
                 <div className="animate-fade-in w-full space-y-4">
                    <div className="bg-white p-4 rounded-xl border-2 border-slate-200 min-h-[80px] flex items-center justify-center">
                        {isGeneratingExample && <p className="text-slate-500 font-semibold animate-pulse">Generating example...</p>}
                        {!isGeneratingExample && exampleSentence && (
                            <div className="text-left w-full">
                                <h4 className="font-bold text-slate-600">💡 Example</h4>
                                <p className="text-slate-800 text-lg mt-1">{exampleSentence}</p>
                            </div>
                        )}
                        {!isGeneratingExample && !exampleSentence && (
                            <p className="text-slate-400">Could not generate an example right now.</p>
                        )}
                    </div>
                    
                    <button onClick={handleNext} className={`w-full font-bold py-4 px-6 rounded-full text-xl shadow-lg transition-all hover:-translate-y-1 text-white ${isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}>
                        {currentIndex < questions.length - 1 ? 'Next' : 'Finish Quiz'}
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};