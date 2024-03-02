import { create } from "zustand";

type Store = {
  isOpen: boolean;
  setIsOpen: (open?: boolean) => void;
};

export const useDrawerHandle = create<Store>()((set) => ({
  isOpen: true,
  setIsOpen: (open) =>
    set((state) => ({ isOpen: open ? true : !state.isOpen })),
}));
