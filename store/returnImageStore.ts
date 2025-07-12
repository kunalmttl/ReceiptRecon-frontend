import { create } from "zustand";

interface ReturnImagesState {
  tagPhoto: string[];
  photos360: string[];           // array of 4 base64 images
  four_photos: string[];           // array of 4 base64 images
  accessoryPhotos: string[];   
  reason: string;
  tries: number;
  photoURI: string[];  // array of 6 base64 images
  setTagPhoto: (data: string[]) => void;
  setPhotos360: (data: string[]) => void;
  setfour_photos: (data: string[]) => void;
  setAccessoryPhotos: (data: string[]) => void;
  setphotoURI: (data: string[]) => void;
  setreason: (data: string) => void;
  settries: (data: number) => void;
  clearAll: () => void;          // to reset when starting over
}

export const useReturnImagesStore = create<ReturnImagesState>((set) => ({
  tagPhoto: [],
  photos360: [],
  four_photos:[],
  photoURI: [],
  reason: "",
  tries: 0,
  accessoryPhotos: [],
  setTagPhoto: (data) => set({ tagPhoto: data }),
  setPhotos360: (data) => set({ photos360: data }),
  setfour_photos: (data) => set({ four_photos: data }),
  setAccessoryPhotos: (data) => set({ accessoryPhotos: data }),
  setphotoURI: (data) => set({photoURI: data}),
  setreason: (data) => set({reason: data}),
  settries: (data) => set({tries: data}),
  clearAll: () =>
    set({
      tagPhoto: [],
      photos360: [],
      four_photos: [],
      accessoryPhotos: [],
      photoURI: [],
      reason: ""
    }),
}));
