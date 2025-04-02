
import { useState, useEffect, useRef } from "react";
import Terminal from "@/components/Terminal";
import GameHeader from "@/components/GameHeader";
import GameFooter from "@/components/GameFooter";
import GameIntro from "@/components/GameIntro";
import { useGameState } from "@/hooks/useGameState";

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const { 
    gameState, 
    processCommand, 
    resetGame,
    currentLevel,
    score
  } = useGameState();

  const startGame = () => {
    setShowIntro(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-green-400 font-mono">
      {showIntro ? (
        <GameIntro onStart={startGame} />
      ) : (
        <>
          <GameHeader level={currentLevel} score={score} onReset={resetGame} />
          <div className="flex-1 container mx-auto p-4 overflow-hidden">
            <Terminal 
              terminalHistory={gameState.history}
              processCommand={processCommand}
            />
          </div>
          <GameFooter />
        </>
      )}
    </div>
  );
};

export default Index;
