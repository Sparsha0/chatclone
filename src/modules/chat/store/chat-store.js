import { create } from "zustand";

export const useChatStore = create((set, get) =>({
    chats:[],
    activeChatId: null,
    setActiveChatId: (chatId) => set({ activeChatId: chatId}),
}))