
import React from "react";
import { Button } from "@/components/ui/button";

interface GameHeaderProps {
  level: number;
  score: number;
  onReset: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ level, score, onReset }) => {
  return (
    <header className="border-b border-green-500/30 bg-gray-900 text-green-400 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl md:text-2xl font-bold text-green-300 mr-4">
            Browser Bash Bonanza
          </h1>
          <span className="hidden md:inline-block text-xs uppercase tracking-wide opacity-70">
            Terminal Adventure
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="px-3 py-1 rounded bg-black/30 text-sm">
            <span className="text-green-200">Level:</span> {level}
          </div>
          <div className="px-3 py-1 rounded bg-black/30 text-sm">
            <span className="text-green-200">Score:</span> {score}
          </div>
          <Button 
            variant="outline" 
            className="border-green-500/50 text-green-400 hover:bg-green-500/10"
            onClick={onReset}
          >
            Reset
          </Button>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
