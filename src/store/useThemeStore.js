import { create } from "zustand";
import { persist } from 'zustand/middleware';

export const useThemeStore = create(persist((set)=> ({
        theme: 'sunset',
        setTheme: (themeParameter) => set({theme: themeParameter})
    }), 
    {
        name: 'webchat-theme'
    }
))