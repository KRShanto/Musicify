import { create } from "zustand";
import { PopupType } from "@/types/popup";

interface PopupState {
  popup: PopupType;
  openPopup: (popup: PopupType) => void;
  closePopup: () => void;
}

const usePopupStore = create<PopupState>((set) => ({
  popup: null,
  openPopup: (popup) => set({ popup }),
  closePopup: () => set({ popup: null }),
}));

export default usePopupStore;
