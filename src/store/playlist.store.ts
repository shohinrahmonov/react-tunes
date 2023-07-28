import {PlaylistModel} from "@models/playlist.model";
import { storage } from "@services/storage.service";
import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";
export const DEFAULT_VOLUME = 50;
const DB_KEY_NAME = "player-store"

interface PlaylistState {
  playlist: PlaylistModel[];
  activeSongIndex: number;
  addPlaylist: (playlist: PlaylistModel[]) => void;
  addSongToPlaylist: (song: PlaylistModel) => void;
  removeSong: (songName: string) => void;
  updateActiveSongIndex: (activeSongIndex: number) => void;
}

export const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set) => ({
      playlist: [],
      activeSongIndex: 0,
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
    }),
    {
      name: DB_KEY_NAME,
      storage: createJSONStorage(() => storage),
    }
  )
);
