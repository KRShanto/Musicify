import { create } from "zustand";

interface AuthState {
  loggedIn: boolean | null;
  setLoggedIn: (loggedIn: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  loggedIn: null,
  setLoggedIn: (loggedIn) => set({ loggedIn }),
}));

export default useAuthStore;
