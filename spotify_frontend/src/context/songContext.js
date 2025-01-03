import { createContext } from "react";

const songContext = createContext({
  currentSong: null,
  setCurrentSong: (currentSong) => {},
  soundPlayed: null,
  setSoundPlayed: () => {},
  isPaused: null,
  setIsPaused: () => {},
  queue: [],
  setQueue: () => {},
  isShuffled: false,
  setIsShuffled: () => {},
  isRepeating: false,
  setIsRepeating: () => {},
  currentSongIndex: -1,
  setCurrentSongIndex: () => {},
  currentTime : 0, 
  setCurrentTime : () => {},
});

export default songContext;