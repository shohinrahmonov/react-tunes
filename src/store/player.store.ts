import {create} from "zustand";

export const DEFAULT_VOLUME = 50;

interface PlayerState {
  playing: boolean;
  volume: number;
  updateVolume: (volume: number) => void;
  updatePlaying: (playing: boolean) => void;
}

export const usePlayerStore = create<PlayerState>()(
    (set) => ({
      volume: DEFAULT_VOLUME,
      playing: false,
      updateVolume: (volume) => set((state) => ({...state, volume})),
      updatePlaying: (playing) => set((state) => ({...state, playing})),
    }),
   
);
