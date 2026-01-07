import { create } from "zustand";
import api from "../lib/axios";
const audio = new Audio("/messageNotif.mp3");

export const useChatStore = create((set, get) => ({
  users: [],
  selectedUserMessages: [],
  selectedUser: null,
  message: {
    text: "",
    attachments: null,
  },
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,
  isLoadingMoreMessage: false,
  latestMessage: null,

  playMusic: () => {
    audio.play();
  },

  setUsers: (newUser) => {
    set({ users: [...get().users, newUser] });
  },

  setLatestMessage: (latestMessage) => set({ latestMessage }),

  setMessage: (message) => set({ message }),

  closeChat: () => set({ selectedUser: null, selectedUserMessages: [] }),

  handleNewMessageListener: (socket) => {
    socket.on("new_message", (newMessage) => {
      if (!get().selectedUser) return;
      if (get().selectedUser.id === newMessage.sender_id) {
        get().addMessageToChat(newMessage);
        get().playMusic();
      }
    });
  },

  handleScrollEvent: async (container) => {
    if (!container) return;

    if (container.scrollTop === 0) {
      const prevScrollHeight = container.scrollHeight;

      await get().getMoreMessages(); // assume this prepends messages to your list

      const newScrollHeight = container.scrollHeight;
      container.scrollTop = newScrollHeight - prevScrollHeight;
    }
  },

  addMessageToChat: (newMessage) => {
    if (!get().selectedUser) return; // prevention for unnecessary adding new message to chat array
    set({ selectedUserMessages: [...get().selectedUserMessages, newMessage] });
  },

  sendMessage: async (message, receiver_id, sender_id) => {
    try {
      set({ isSendingMessage: true });
      const tempId = Date.now();
      const tempMessage = {
        ...message,
        receiver_id,
        sender_id,
        isSending: true,
        created_at: new Date(),
        tempId,
      };
      get().addMessageToChat(tempMessage);
      set({ latestMessage: tempMessage });
      const res = await api.post(`/messages/${receiver_id}`, message);
      const updatedMessages = get().selectedUserMessages.map((msg) =>
        msg.tempId === tempId ? res.data.data : msg
      );
      set({ selectedUserMessages: updatedMessages });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isSendingMessage: false });
    }
  },

  getUsers: async () => {
    try {
      set({ isUsersLoading: true });
      const res = await api.get("/auth/getUsers");
      set({ users: res.data.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesFromTo: async (receiverInfo) => {
    try {
      if (get().selectedUser?.id === receiverInfo.id) return;
      set({ isMessagesLoading: true });
      const res = await api.get(`/messages/get/${receiverInfo.id}`);
      set({ selectedUserMessages: res.data.data.reverse() });
      set({ selectedUser: receiverInfo });
      set({ latestMessage: res.data.data[res.data.data.length - 1] });
      console.log("Selected user:", receiverInfo);
    } catch (error) {
      console.log(error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  getMoreMessages: async () => {
    try {
      if (get().selectedUserMessages.length === 0) return;

      set({ isLoadingMoreMessage: true });
      const res = await api.get(
        `/messages/loadMore?receiver_id=${get().selectedUser.id}&oldestDate=${
          get().selectedUserMessages[0]?.created_at
        }&limit=10`
      );

      if (res.data.data.length === 0) return;
      set({
        selectedUserMessages: [
          ...res.data.data.reverse(),
          ...get().selectedUserMessages,
        ],
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoadingMoreMessage: false });
    }
  },

  scrollBottom: (bottomRef) => {
    if (!get().latestMessage || !get().selectedUserMessages.length) return;

    const latestTime = new Date(get().latestMessage.created_at);
    const lastMessageTime = new Date(
      get().selectedUserMessages[
        get().selectedUserMessages.length - 1
      ].created_at
    );
    if (latestTime >= lastMessageTime) {
      bottomRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
    }
    get().setLatestMessage(null);
  },

  getMessageImages: () => {
    return get().selectedUserMessages.filter((msg) => msg.image);
  },
}));
