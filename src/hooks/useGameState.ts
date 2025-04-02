
import { useState, useEffect } from "react";
import { gameLevels } from "@/lib/gameLevels";
import { toast } from "@/components/ui/use-toast";

interface HistoryEntry {
  type: "command" | "response" | "error" | "success";
  content: string;
}

interface GameState {
  currentLevel: number;
  score: number;
  history: HistoryEntry[];
  completedLevels: number[];
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    score: 0,
    history: [
      { 
        type: "response", 
        content: "Welcome to Browser Bash Bonanza! Type 'help' to see available commands." 
      },
      {
        type: "response",
        content: "Current mission: " + gameLevels[0].description
      }
    ],
    completedLevels: [],
  });

  const addToHistory = (entry: HistoryEntry) => {
    setGameState(prev => ({
      ...prev,
      history: [...prev.history, entry],
    }));
  };

  const processCommand = (command: string) => {
    // Add the command to history
    addToHistory({ type: "command", content: command });

    // Process the command
    const cmd = command.trim().toLowerCase();
    const currentLevelData = gameLevels[gameState.currentLevel - 1];

    // Help command
    if (cmd === "help") {
      addToHistory({
        type: "response",
        content: "Available commands:\n" +
                 "- help: Show this help message\n" +
                 "- mission: Show current mission\n" +
                 "- clear: Clear terminal\n" +
                 "- score: Show current score\n" +
                 "- level: Show current level\n" +
                 `- ${currentLevelData.availableCommands.join("\n- ")}`
      });
      return;
    }

    // Clear command
    if (cmd === "clear") {
      setGameState(prev => ({
        ...prev,
        history: [],
      }));
      return;
    }

    // Mission command
    if (cmd === "mission") {
      addToHistory({
        type: "response",
        content: currentLevelData.description
      });
      return;
    }

    // Score command
    if (cmd === "score") {
      addToHistory({
        type: "response",
        content: `Your current score is: ${gameState.score}`
      });
      return;
    }

    // Level command
    if (cmd === "level") {
      addToHistory({
        type: "response",
        content: `You are on level ${gameState.currentLevel} of ${gameLevels.length}`
      });
      return;
    }

    // Check if it's a level-specific command
    const commandMatch = currentLevelData.commands.find(c => 
      (typeof c.match === 'string' && cmd === c.match) || 
      (c.match instanceof RegExp && c.match.test(cmd))
    );

    if (commandMatch) {
      // Process the command
      addToHistory({
        type: commandMatch.success ? "success" : "response",
        content: commandMatch.response
      });

      // If the command was a success command
      if (commandMatch.success) {
        const newScore = gameState.score + currentLevelData.pointsValue;
        
        setGameState(prev => {
          // Check if this level was already completed
          if (prev.completedLevels.includes(prev.currentLevel)) {
            addToHistory({
              type: "response",
              content: "You've already completed this level! No additional points awarded."
            });
            return prev;
          }
          
          // If this is the last level
          if (prev.currentLevel === gameLevels.length) {
            addToHistory({
              type: "success",
              content: "🎉 Congratulations! You've completed all levels of Browser Bash Bonanza! 🎉\nFinal score: " + newScore
            });
            return {
              ...prev,
              score: newScore,
              completedLevels: [...prev.completedLevels, prev.currentLevel]
            };
          }
          
          // Move to the next level
          addToHistory({
            type: "success",
            content: `Level ${prev.currentLevel} completed! +${currentLevelData.pointsValue} points!\nMoving to level ${prev.currentLevel + 1}...`
          });
          
          // Add the next level's description
          setTimeout(() => {
            addToHistory({
              type: "response",
              content: "New mission: " + gameLevels[prev.currentLevel].description
            });
          }, 500);
          
          return {
            ...prev,
            currentLevel: prev.currentLevel + 1,
            score: newScore,
            completedLevels: [...prev.completedLevels, prev.currentLevel]
          };
        });
        
        // Show toast notification
        toast({
          title: `Level ${gameState.currentLevel} completed!`,
          description: `You earned ${currentLevelData.pointsValue} points!`,
        });
      }
      return;
    }

    // Command not recognized
    addToHistory({
      type: "error",
      content: `Command not recognized: '${cmd}'. Type 'help' for available commands.`
    });
  };

  const resetGame = () => {
    setGameState({
      currentLevel: 1,
      score: 0,
      history: [
        { 
          type: "response", 
          content: "Game reset! Welcome back to Browser Bash Bonanza! Type 'help' to see available commands." 
        },
        {
          type: "response",
          content: "Current mission: " + gameLevels[0].description
        }
      ],
      completedLevels: [],
    });
    
    toast({
      title: "Game Reset",
      description: "All progress has been reset. Good luck on your new mission!",
    });
  };

  return {
    gameState,
    processCommand,
    resetGame,
    currentLevel: gameState.currentLevel,
    score: gameState.score
  };
};
