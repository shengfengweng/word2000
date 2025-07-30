
import React from 'react';
import { Word } from '../types';

interface WordListProps {
  words: Word[] | null;
  groupedWords: Record<string, Word[]>;
  searchTerm: string;
}

const WordCard: React.FC<{ word: Word }> = ({ word }) => (
    <div className="bg-slate-800 rounded-lg p-4 shadow-lg hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-baseline">
            <h3 className="text-lg font-semibold text-sky-400">{word.english}</h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-700 px-2 py-1 rounded-full">{word.pos}</span>
        </div>
        <p className="text-slate-300 mt-2 font-['Noto_Sans_TC']">{word.chinese}</p>
    </div>
);


export const WordList: React.FC<WordListProps> = ({ words, groupedWords, searchTerm }) => {
  if (words) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-300 border-b-2 border-slate-700 pb-2">
          Search Results for "{searchTerm}"
        </h2>
        {words.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {words.map((word, index) => (
               <WordCard key={`${word.english}-${index}`} word={word} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400">No words found. Try a different search term.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {Object.entries(groupedWords).map(([letter, wordList]) => (
        <section key={letter} id={`section-${letter}`} className="scroll-mt-24">
          <h2 className="text-3xl font-bold text-sky-500 border-b-2 border-slate-700 pb-2 mb-6">
            {letter}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {wordList.map((word, index) => (
                <WordCard key={`${word.english}-${index}`} word={word} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
