
import React from 'react';

interface AlphabetNavigatorProps {
  alphabet: string[];
}

export const AlphabetNavigator: React.FC<AlphabetNavigatorProps> = ({ alphabet }) => {
  return (
    <nav className="hidden md:block sticky top-24 h-[calc(100vh-6rem)] pr-4">
      <ul className="flex flex-col space-y-2">
        {alphabet.map((letter) => (
          <li key={letter}>
            <a
              href={`#section-${letter}`}
              className="text-slate-400 hover:text-sky-400 font-bold transition-colors duration-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800"
            >
              {letter}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
