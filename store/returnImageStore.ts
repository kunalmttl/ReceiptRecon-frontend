import { create } from "zustand";

interface ReturnImagesState {
  tagPhoto: string[];
  photos360: string[];           // array of 5 base64 images
  accessoryPhotos: string[];   
  reason: string;
  photoURI: string[];  // array of 6 base64 images
  setTagPhoto: (data: string[]) => void;
  setPhotos360: (data: string[]) => void;
  setAccessoryPhotos: (data: string[]) => void;
  setphotoURI: (data: string[]) => void;
  setreason: (data: string) => void;
  clearAll: () => void;          // to reset when starting over
}

export const useReturnImagesStore = create<ReturnImagesState>((set) => ({
  tagPhoto: [],
  photos360: [],
  photoURI: [],
  reason: "",
  accessoryPhotos: [],
  setTagPhoto: (data) => set({ tagPhoto: data }),
  setPhotos360: (data) => set({ photos360: data }),
  setAccessoryPhotos: (data) => set({ accessoryPhotos: data }),
  setphotoURI: (data) => set({photoURI: data}),
  setreason: (data) => set({reason: data}),
  clearAll: () =>
    set({
      tagPhoto: [],
      photos360: [],
      accessoryPhotos: [],
      photoURI: []
    }),
}));
