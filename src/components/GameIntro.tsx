
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface GameIntroProps {
  onStart: () => void;
}

const GameIntro: React.FC<GameIntroProps> = ({ onStart }) => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Welcome to Browser Bash Bonanza, a terminal adventure game. Your mission: solve puzzles, hack systems, and find the hidden flag in each level using your command-line skills. Are you ready to test your terminal prowess?";
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    if (textIndex < fullText.length) {
      const timer = setTimeout(() => {
        setTypedText(prev => prev + fullText.charAt(textIndex));
        setTextIndex(textIndex + 1);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [textIndex, fullText]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black animate-in fade-in duration-700">
      <div className="max-w-2xl w-full bg-gray-900 border border-green-500/30 rounded-lg p-6 shadow-[0_0_25px_rgba(0,255,0,0.15)]">
        <h1 className="text-4xl font-bold mb-6 text-center text-green-400 glitch-text">
          Browser Bash Bonanza
        </h1>
        
        <div className="h-48 mb-6 overflow-hidden terminal-output">
          <p className="text-green-400 font-mono leading-relaxed">
            {typedText}
            <span className="cursor inline-block animate-blink">_</span>
          </p>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={onStart}
            className="px-8 py-6 text-lg bg-green-700 hover:bg-green-600 text-white shadow-lg transition-all hover:scale-105"
          >
            $ ./start_game.sh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameIntro;
