import { create } from "zustand";
import { PlaylistType } from "../types/data/playlist";

interface PlaylistState {
  playlists: PlaylistType[];
  setPlaylists: (playlists: PlaylistType[]) => void;
  addPlaylist: (playlist: PlaylistType) => void;
}

const usePlaylistStore = create<PlaylistState>((set) => ({
  playlists: [] as PlaylistType[],
  setPlaylists: (playlists: PlaylistType[]) => set({ playlists }),
  addPlaylist: (playlist: PlaylistType) => {
    set((state) => ({
      playlists: [...state.playlists, playlist],
    }));
  },
}));

export default usePlaylistStore;
