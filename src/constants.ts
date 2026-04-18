import { Track } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 60;

export const PLAYLIST: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Virtuoso',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder audio
    duration: '6:12',
  },
  {
    id: '2',
    title: 'Cyber Drift',
    artist: 'Synthetic Mind',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05',
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'Circuit Soul',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:48',
  },
];
