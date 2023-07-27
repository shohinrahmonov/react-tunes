import {PlaylistModel} from "@models/playlist.model";
import {create} from "zustand";
export const DEFAULT_VOLUME = 50;
interface PlayerState {
  playing: boolean;
  playlist: PlaylistModel[];
  activeSongIndex: number;
  volume: number;
  addPlaylist: (playlist: PlaylistModel[]) => void;
  addSongToPlaylist: (song: PlaylistModel) => void;
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
  addPlaylist: (playlist) =>
    set((state) => {
      // Filter out songs with duplicate ids, provider, name from the incoming playlist
      const filteredPlaylist = playlist.filter(
        (newSong) =>
          !state.playlist.some(
            (existingSong) =>
              existingSong.id === newSong.id ||
              (existingSong.provider === newSong.provider &&
                existingSong.title === newSong.title)
          )
      );

      // Merge the existing playlist with the filtered one (removing duplicates)
      const mergedPlaylist = [...state.playlist, ...filteredPlaylist];

      return {...state, playlist: mergedPlaylist};
    }),
  addSongToPlaylist: (song) =>
    set((state) => ({...state, playlist: [...state.playlist, song]})),
  removeSong: (songName) =>
    set((state) => ({
      ...state,
      playlist: state.playlist.filter((song) => song.title !== songName),
    })),
  updateActiveSongIndex: (activeSongIndex) =>
    set((state) => ({
      ...state,
      playing: true,
      activeSongIndex,
    })),
  updateVolume: (volume) => set((state) => ({...state, volume})),
  updatePlaying: (playing) => set((state) => ({...state, playing})),
}));
