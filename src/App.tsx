import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#00FFFF] flex flex-col items-center justify-center font-digital overflow-hidden crt relative selection:bg-[#FF00FF] selection:text-black">
      <div className="static-bg"></div>

      <header className="mb-8 text-center z-10 mt-8 screen-tear">
        <h1 className="text-3xl md:text-5xl font-pixel mb-6 glitch-text" data-text="SYS.NEON_SNAKE">
          SYS.NEON_SNAKE
        </h1>
        <div className="text-3xl font-digital bg-[#FF00FF] text-black inline-block px-4 py-1 border-2 border-[#00FFFF] shadow-[4px_4px_0px_#00FFFF]">
          DATA_YIELD: {score.toString().padStart(4, '0')}
        </div>
      </header>

      <main className="flex flex-col md:flex-row gap-12 items-start z-10 w-full max-w-5xl px-4 justify-center mb-8">
        <div className="w-full max-w-[400px] glitch-border bg-black p-2">
          <div className="text-sm mb-2 border-b-2 border-[#FF00FF] pb-1 flex justify-between">
            <span>PROCESS: SNAKE.EXE</span>
            <span className="animate-pulse text-[#FF00FF]">STATUS: ACTIVE</span>
          </div>
          <SnakeGame onScoreChange={setScore} />
        </div>

        <div className="w-full max-w-sm glitch-border bg-black p-2">
          <div className="text-sm mb-2 border-b-2 border-[#00FFFF] pb-1 flex justify-between text-[#FF00FF]">
            <span>PROCESS: AUDIO_STREAM</span>
            <span className="animate-pulse text-[#00FFFF]">LINK: ESTABLISHED</span>
          </div>
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
