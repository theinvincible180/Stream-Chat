import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme :localStorage.getItem("streamchat-theme") || "coffee",
  setTheme : (theme) => {
    set({theme})
    localStorage.setItem("streamchat-theme", theme)
  },
}))