
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TerminalProps {
  terminalHistory: Array<{
    type: "command" | "response" | "error" | "success";
    content: string;
  }>;
  processCommand: (command: string) => void;
}

const Terminal: React.FC<TerminalProps> = ({ terminalHistory, processCommand }) => {
  const [command, setCommand] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      processCommand(command);
      setCommand("");
    }
  };

  useEffect(() => {
    // Scroll to bottom when history updates
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    // Focus input on mount and after commands
    inputRef.current?.focus();
  }, [terminalHistory]);

  return (
    <div className="flex flex-col h-full rounded-md border border-green-500/30 bg-black/90 overflow-hidden shadow-[0_0_15px_rgba(0,255,0,0.2)]">
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto terminal-scrollbar"
      >
        {terminalHistory.map((entry, index) => (
          <div 
            key={index} 
            className={cn(
              "mb-2 font-mono",
              entry.type === "command" && "text-cyan-400",
              entry.type === "response" && "text-green-400",
              entry.type === "error" && "text-red-400",
              entry.type === "success" && "text-yellow-400"
            )}
          >
            {entry.type === "command" ? (
              <div className="flex">
                <span className="text-green-500 mr-2">$</span>
                <span>{entry.content}</span>
              </div>
            ) : (
              <div className="pl-4 terminal-output">
                {entry.content.split("\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <form 
        onSubmit={handleSubmit}
        className="border-t border-green-500/30 p-3 flex items-center bg-black/50"
      >
        <span className="text-green-500 mr-2">$</span>
        <Input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="flex-1 bg-transparent border-none text-green-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Type your command..."
          autoComplete="off"
          autoFocus
        />
        <Button 
          type="submit" 
          className="ml-2 bg-green-800 hover:bg-green-700 text-green-100"
        >
          Enter
        </Button>
      </form>
    </div>
  );
};

export default Terminal;
