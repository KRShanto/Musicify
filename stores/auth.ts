import { create } from "zustand";

interface AuthState {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  loggedIn: false,
  setLoggedIn: (loggedIn) => set({ loggedIn }),
}));
