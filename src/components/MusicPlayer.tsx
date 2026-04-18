import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Music2, Volume2 } from 'lucide-react';
import { PLAYLIST } from '../constants';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback failed", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleSkipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handleSkipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="w-[300px] flex flex-col gap-6 p-6 bg-glass-surface backdrop-blur-[15px] rounded-[24px] border border-glass-border shadow-2xl">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleSkipForward}
      />

      <div className="now-playing text-center">
        {/* Album Art with the specific gradient and shadow from design */}
        <div className="relative w-[180px] h-[180px] mx-auto mb-5 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-pink shadow-[0_0_20px_rgba(0,243,255,0.3)] flex items-center justify-center overflow-hidden">
          <div className="absolute w-10 h-10 rounded-full bg-[#050505] border-4 border-white/10" />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrackIndex}
              initial={{ opacity: 0, rotate: -20 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 20 }}
              className="z-10"
            >
              <Music2 size={48} className="text-white/20" />
            </motion.div>
          </AnimatePresence>
          
          {/* Animated visualizer overlaying the album art slightly */}
          <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-center gap-[2px] px-4 opacity-50">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-white"
                animate={{
                  height: isPlaying ? [4, Math.random() * 20 + 4, 4] : 2
                }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.04 }}
              />
            ))}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-1 truncate">{currentTrack.title}</h3>
        <p className="artist-name text-sm opacity-60 mb-5">{currentTrack.artist}</p>
        
        {/* Progress bar from design */}
        <div className="w-full h-1 bg-white/10 rounded-full relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-neon-cyan shadow-[0_0_8px_#00f3ff]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="playlist flex-1 overflow-hidden">
        {PLAYLIST.map((track, idx) => (
          <div 
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(idx);
              setIsPlaying(true);
            }}
            className={`flex items-center gap-3 p-3 rounded-xl mb-2 cursor-pointer transition-all border border-transparent ${
              idx === currentTrackIndex 
                ? 'bg-neon-cyan/5 border-neon-cyan/30' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${idx === currentTrackIndex ? 'bg-neon-cyan' : 'bg-white/20'}`} />
            <span className={`text-xs font-medium ${idx === currentTrackIndex ? 'text-neon-cyan' : 'text-white/60'}`}>
              {track.title}
            </span>
          </div>
        ))}
      </div>

      <div className="controls flex items-center justify-center gap-5 mt-2">
        <button 
          onClick={handleSkipBack}
          className="w-11 h-11 rounded-full border border-glass-border bg-glass-surface flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <SkipBack size={18} />
        </button>

        <button 
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-neon-cyan text-[#050505] flex items-center justify-center shadow-[0_0_15px_#00f3ff] hover:scale-105 transition-transform"
        >
          {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} />}
        </button>

        <button 
          onClick={handleSkipForward}
          className="w-11 h-11 rounded-full border border-glass-border bg-glass-surface flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <SkipForward size={18} />
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
