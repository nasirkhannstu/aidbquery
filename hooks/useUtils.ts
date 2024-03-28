import { create } from "zustand";

type Store = {
  isOpenUploadModal: boolean;
  setOpenUploadModal: () => void;
  setCloseUploadModal: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isOpenAdminSidebar: boolean;
  setOpenAdminSidebar: () => void;
};

export const useUtils = create<Store>()((set) => ({
  isOpenUploadModal: false,
  setOpenUploadModal: () => set(() => ({ isOpenUploadModal: true })),
  setCloseUploadModal: () => set(() => ({ isOpenUploadModal: false })),
  isSidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  isOpenAdminSidebar: false,
  setOpenAdminSidebar: () =>
    set((state) => ({ isOpenAdminSidebar: !state.isOpenAdminSidebar })),
}));
