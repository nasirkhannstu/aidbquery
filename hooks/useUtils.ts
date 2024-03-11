import { create } from "zustand";

type Store = {
  isOpenUploadModal: boolean;
  setOpenUploadModal: () => void;
  setCloseUploadModal: () => void;
};

export const useUtils = create<Store>()((set) => ({
  isOpenUploadModal: false,
  setOpenUploadModal: () => set(() => ({ isOpenUploadModal: true })),
  setCloseUploadModal: () => set(() => ({ isOpenUploadModal: false })),
}));
