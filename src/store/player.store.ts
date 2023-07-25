import {PlaylistModel} from "src/models/playlist.model";
import {create} from "zustand";
export const DEFAULT_VOLUME = 50;
interface PlayerState {
  playing: boolean;
  playlist: PlaylistModel[];
  activeSongIndex: number;
  volume: number;
  addPlaylist: (playlist: PlaylistModel[]) => void;
  removeSong: (songName: string) => void;
  updateActiveSongIndex: (activeSongIndex: number) => void;
  updateVolume: (volume: number) => void;
  updatePlaying: (playing: boolean) => void;
}

export const usePlayerStore = create<PlayerState>()((set) => ({
  playlist: [],
  activeSongIndex: 0,
  volume: DEFAULT_VOLUME,
  playing: false,
  addPlaylist: (playlist) => set((state) => ({...state, playlist: playlist})),
  removeSong: (songName) =>
    set((state) => ({
      ...state,
      playlist: state.playlist.filter((song) => song.title !== songName),
    })),
  updateActiveSongIndex: (activeSongIndex) =>
    set((state) => ({
      ...state,
      activeSongIndex,
    })),
  updateVolume: (volume) => set((state) => ({...state, volume})),
  updatePlaying: (playing) => set((state) => ({...state, playing})),
}));
