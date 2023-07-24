import {PlaylistModel} from "src/models/playlist.model";
import {create} from "zustand";
export const DEFAULT_VOLUME = 50;
interface PlayerState {
  playing: boolean;
  playlist: PlaylistModel[];
  duration: number;
  currentTime: number;
  activeSongIndex: number;
  volume: number;
  addPlaylist: (playlist: PlaylistModel[]) => void;
  removeSong: (songName: string) => void;
  updateDuration: (duration: number) => void;
  updateCurrentTime: (currentTime: number) => void;
  updateActiveSongIndex: (activeSongIndex: number) => void;
  updateVolume: (volume: number) => void;
  updatePlaying: (playing: boolean) => void;
}

export const usePlayerStore = create<PlayerState>()((set) => ({
  playlist: [],
  duration: 0,
  currentTime: 0,
  activeSongIndex: 0,
  volume: DEFAULT_VOLUME,
  playing: false,
  addPlaylist: (playlist) => set((state) => ({...state, playlist: playlist})),
  removeSong: (songName) =>
    set((state) => ({
      ...state,
      duration: 0,
      currentTime: 0,
      playlist: state.playlist.filter((song) => song.title !== songName),
    })),
  updateDuration: (duration) => set((state) => ({...state, duration})),
  updateCurrentTime: (currentTime) => set((state) => ({...state, currentTime})),
  updateActiveSongIndex: (activeSongIndex) =>
    set((state) => ({
      ...state,
      duration: 0,
      currentTime: 0,
      activeSongIndex,
    })),
  updateVolume: (volume) => set((state) => ({...state, volume})),
  updatePlaying: (playing) => set((state) => ({...state, playing})),
}));
