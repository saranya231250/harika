import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, RotateCcw, Pause } from 'lucide-react';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';
import { Point, Direction, GameState } from '../types';

const SnakeGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
    food: { x: 5, y: 5 },
    direction: 'UP',
    isGameOver: false,
    score: 0,
    highScore: 0,
    status: 'IDLE',
  });

  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
      food: generateFood([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]),
      direction: 'UP',
      isGameOver: false,
      score: 0,
      status: 'PLAYING',
    }));
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (gameState.status !== 'PLAYING' || gameState.isGameOver) return;

    setGameState(prev => {
      const head = { ...prev.snake[0] };
      switch (prev.direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collisions with wall
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return { ...prev, isGameOver: true, status: 'IDLE', highScore: Math.max(prev.highScore, prev.score) };
      }

      // Check collisions with self
      if (prev.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return { ...prev, isGameOver: true, status: 'IDLE', highScore: Math.max(prev.highScore, prev.score) };
      }

      const newSnake = [head, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;

      // Check food
      if (head.x === prev.food.x && head.y === prev.food.y) {
        newFood = generateFood(newSnake);
        newScore += 10;
        setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return { ...prev, snake: newSnake, food: newFood, score: newScore };
    });
  }, [gameState.status, gameState.isGameOver, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (gameState.direction !== 'DOWN') setGameState(p => ({ ...p, direction: 'UP' })); break;
        case 'ArrowDown': if (gameState.direction !== 'UP') setGameState(p => ({ ...p, direction: 'DOWN' })); break;
        case 'ArrowLeft': if (gameState.direction !== 'RIGHT') setGameState(p => ({ ...p, direction: 'LEFT' })); break;
        case 'ArrowRight': if (gameState.direction !== 'LEFT') setGameState(p => ({ ...p, direction: 'RIGHT' })); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, speed]);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex justify-between items-end px-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[2px] opacity-50 font-medium">Current Score</span>
          <span className="text-3xl font-extrabold text-neon-cyan drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
            {gameState.score.toLocaleString('en-US', { minimumIntegerDigits: 4, useGrouping: false })}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-[2px] opacity-50 font-medium">High Score</span>
          <span className="text-3xl font-extrabold text-neon-pink drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">
            {gameState.highScore.toLocaleString('en-US', { minimumIntegerDigits: 4, useGrouping: false })}
          </span>
        </div>
      </header>

      <div 
        className="relative bg-black/40 border-2 border-neon-pink rounded-[24px] overflow-hidden shadow-[inset_0_0_40px_rgba(255,0,255,0.1),0_0_20px_rgba(255,0,255,0.2)]"
        style={{ width: 400, height: 400 }}
      >
        {/* Grid Background from design */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20" 
          style={{ 
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }} 
        />

        {/* Snake Body */}
        {gameState.snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            layoutId={`snake-${i}`}
            className={`absolute ${i === 0 ? 'z-20' : 'z-10'}`}
            style={{
              width: 18,
              height: 18,
              left: segment.x * 20 + 1,
              top: segment.y * 20 + 1,
              borderRadius: '4px',
              background: i === 0 ? '#fff' : 'var(--neon-cyan)',
              boxShadow: i === 0 ? '0 0 15px #fff' : '0 0 8px var(--neon-cyan)',
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bg-neon-pink rounded-full z-5"
          style={{
            width: 14,
            height: 14,
            left: gameState.food.x * 20 + 3,
            top: gameState.food.y * 20 + 3,
            boxShadow: '0 0 12px var(--neon-pink)',
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {gameState.status === 'IDLE' && !gameState.isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-8 backdrop-blur-md z-30"
            >
              <h2 className="text-2xl font-black text-white mb-6 tracking-widest uppercase italic">SynthSnake</h2>
              <button 
                onClick={resetGame}
                className="w-16 h-16 rounded-full bg-neon-cyan text-black flex items-center justify-center shadow-[0_0_20px_#00f3ff] hover:scale-110 transition-transform"
              >
                <Play fill="currentColor" size={32} />
              </button>
              <p className="mt-8 text-white/40 text-[10px] font-mono tracking-[0.3em] uppercase">Use Arrow Keys to Move</p>
            </motion.div>
          )}

          {gameState.isGameOver && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-neon-pink/10 backdrop-blur-xl flex flex-col items-center justify-center p-8 z-40"
            >
              <h2 className="text-4xl font-black text-white mb-2 tracking-tighter italic">OVERDRIVE FAIL</h2>
              <p className="text-neon-pink text-xs font-mono mb-8 uppercase tracking-widest">System reboot required</p>
              <button 
                onClick={resetGame}
                className="flex items-center gap-3 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors"
              >
                <RotateCcw size={20} /> REBOOT
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="text-center text-[10px] opacity-40 uppercase tracking-[2px] mt-2">
        Use Arrow Keys to Navigate • Space to Boost
      </footer>
    </div>
  );
};

export default SnakeGame;
