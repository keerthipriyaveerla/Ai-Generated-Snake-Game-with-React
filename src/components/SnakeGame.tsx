import React, { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const INITIAL_SPEED = 100;

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const snakeRef = useRef<Point[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const directionRef = useRef<Point>({ x: 0, y: -1 });
  const nextDirectionRef = useRef<Point>({ x: 0, y: -1 });
  const foodRef = useRef<Point>({ x: 5, y: 5 });
  const lastUpdateRef = useRef<number>(0);
  const speedRef = useRef<number>(INITIAL_SPEED);
  const requestRef = useRef<number>();

  const generateFood = () => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = snakeRef.current.some(
        (segment) => segment.x === newFood!.x && segment.y === newFood!.y
      );
    }
    foodRef.current = newFood!;
  };

  const resetGame = () => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    directionRef.current = { x: 0, y: -1 };
    nextDirectionRef.current = { x: 0, y: -1 };
    speedRef.current = INITIAL_SPEED;
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
    generateFood();
    setIsPlaying(true);
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.15;
    for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Draw food (Magenta)
    const food = foodRef.current;
    ctx.fillStyle = '#FF00FF';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    // Glitch artifact on food
    if (Math.random() > 0.8) {
      ctx.fillStyle = '#00FFFF';
      ctx.fillRect(food.x * CELL_SIZE - 2, food.y * CELL_SIZE + 2, CELL_SIZE, 2);
    }

    // Draw snake (Cyan)
    const snake = snakeRef.current;
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#FFFFFF' : '#00FFFF';
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      
      // Harsh inner border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
  };

  const update = (time: number) => {
    if (!isPlaying || gameOver) return;

    if (time - lastUpdateRef.current > speedRef.current) {
      const snake = [...snakeRef.current];
      const head = { ...snake[0] };
      
      directionRef.current = nextDirectionRef.current;
      const dir = directionRef.current;

      head.x += dir.x;
      head.y += dir.y;

      // Wall collision
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        setGameOver(true);
        setIsPlaying(false);
        return;
      }

      // Self collision
      if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return;
      }

      snake.unshift(head);

      // Food collision
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore((s) => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        speedRef.current = Math.max(40, speedRef.current - 3);
        generateFood();
      } else {
        snake.pop();
      }

      snakeRef.current = snake;
      lastUpdateRef.current = time;
    }
  };

  const gameLoop = (time: number) => {
    update(time);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) draw(ctx);
    }
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const dir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (dir.y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (dir.y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (dir.x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (dir.x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
          break;
        case ' ':
          if (!isPlaying && !gameOver) {
            setIsPlaying(true);
          } else if (gameOver) {
            resetGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (canvasRef.current && !isPlaying && !gameOver) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) draw(ctx);
    }
  }, []);

  return (
    <div className="relative border-2 border-[#00FFFF]">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="bg-black block"
        style={{ width: '100%', maxWidth: '400px', height: 'auto', aspectRatio: '1/1' }}
      />
      
      {(!isPlaying || gameOver) && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-6 border-4 border-[#FF00FF] screen-tear">
          {gameOver ? (
            <>
              <h2 className="text-2xl md:text-3xl font-pixel text-[#FF00FF] mb-4 glitch-text" data-text="CRITICAL_FAILURE">CRITICAL_FAILURE</h2>
              <p className="text-2xl text-[#00FFFF] mb-8 font-digital bg-black border border-[#00FFFF] p-2 shadow-[2px_2px_0px_#FF00FF]">
                DATA_CORRUPTED: {score}
              </p>
              <button 
                onClick={resetGame}
                className="px-6 py-3 bg-[#00FFFF] text-black font-pixel text-xs md:text-sm hover:bg-[#FF00FF] hover:text-white transition-none border-2 border-white uppercase"
              >
                EXECUTE_REBOOT
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl md:text-2xl font-pixel text-[#00FFFF] mb-6 glitch-text" data-text="SYSTEM.READY">SYSTEM.READY</h2>
              <p className="text-[#FF00FF] mb-8 font-digital text-xl md:text-2xl bg-black border border-[#FF00FF] p-2">
                AWAITING_INPUT<br/>[W,A,S,D] OR [ARROWS]
              </p>
              <button 
                onClick={() => setIsPlaying(true)}
                className="px-8 py-3 bg-[#FF00FF] text-black font-pixel text-xs md:text-sm hover:bg-[#00FFFF] hover:text-black transition-none border-2 border-white uppercase"
              >
                INITIALIZE
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
