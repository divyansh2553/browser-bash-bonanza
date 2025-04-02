
import React from "react";

const GameFooter: React.FC = () => {
  return (
    <footer className="border-t border-green-500/30 bg-gray-900 text-green-400 p-3 text-center text-sm">
      <div className="container mx-auto">
        <p>Type <span className="text-yellow-300 font-bold">help</span> to see available commands</p>
      </div>
    </footer>
  );
};

export default GameFooter;
