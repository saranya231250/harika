/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import BackgroundEffects from './components/BackgroundEffects';
import { Headphones, Gamepad2, Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen text-white font-sans selection:bg-neon-cyan/30 selection:text-neon-cyan">
      <BackgroundEffects />
      
      {/* Header - Keeping it minimal and styled with glass */}
      <header className="fixed top-0 left-0 right-0 z-50 px-10 py-6 flex justify-between items-center bg-black/20 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-neon-cyan flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.4)]">
            <Sparkles className="text-[#050505]" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic text-white flex items-center gap-2">
              SYNTHTIME <span className="text-neon-cyan/50 text-xs font-mono tracking-[0.2em] not-italic ml-2">v2.0</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-glass-border bg-glass-surface">
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_#00f3ff]" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-neon-cyan/80">Active Session</span>
          </div>
        </div>
      </header>

      {/* Main Grid Layout from Design */}
      <main className="relative z-10 pt-32 pb-10 px-10 max-w-[1200px] mx-auto h-screen min-h-[800px]">
        <div className="grid grid-cols-[300px_1fr] gap-[30px] h-full max-h-[700px]">
          
          {/* Left Panel: Music Player (using the provided logic and restyled component) */}
          <motion.aside 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-full"
          >
            <MusicPlayer />
          </motion.aside>

          {/* Right Panel: Game Area */}
          <motion.section 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div className="flex-1 flex items-center justify-center">
              <SnakeGame />
            </div>
            
            {/* Contextual Info - styled like a glass footer card */}
            <div className="p-6 bg-glass-surface backdrop-blur-md rounded-3xl border border-glass-border">
              <div className="flex justify-between items-center">
                <div className="flex gap-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-widest text-white/40">Status</span>
                    <span className="text-xs font-bold text-neon-cyan">Optimal</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-widest text-white/40">Mode</span>
                    <span className="text-xs font-bold text-neon-pink">Endless</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-widest text-white/40">Bitrate</span>
                    <span className="text-xs font-bold text-white">320kbps</span>
                  </div>
                </div>
                <div className="text-[10px] text-white/20 uppercase tracking-widest italic">
                  SynthSnake Music & Game Hub
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Branded elements */}
      <div className="fixed bottom-8 left-8 flex flex-col opacity-10 pointer-events-none select-none">
        <span className="text-[6vw] font-black leading-[0.8]">CYBER</span>
        <span className="text-[6vw] font-black leading-[0.8]">SPACE</span>
      </div>
    </div>
  );
}
