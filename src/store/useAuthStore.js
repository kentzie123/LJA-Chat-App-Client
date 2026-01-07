import { create } from "zustand";
import api from "../lib/axios";

import io from "socket.io-client";

// Store
import { useChatStore } from "./useChatStore";
import { useVideoCallStore } from "./useVideoCallStore";

// Toast
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isLoggingIn: false,
  isSigningUp: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      query: {
        userId: authUser.id,
      },
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.connected);
      set({ socket });
    });

    // Get online users listener
    socket.on("getOnlineUsers", (userIds) => {
      console.log("Online users:", userIds);
      set({ onlineUsers: userIds });
    });

    // New message listener
    useChatStore.getState().handleNewMessageListener(socket);

    // Incoming-call listener
    useVideoCallStore.getState().handleCallListeners(socket);

    // New user listener
    get().handleNewUserListener(socket);
  },

  handleNewUserListener: (socket) => {
    const { setUsers } = useChatStore.getState();
    socket.on("new_user", (newUser) => {
      setUsers(newUser);
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

  updateProfile: async (updatedFields) => {
    try {
      set({ isUpdatingProfile: true });
      const res = await api.put("/users/update-user", updatedFields);
      set({ authUser: res.data.data });
      toast.success("Updated successfully");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const res = await api.post("/auth/login", data);
      set({ authUser: res.data.data });
      get().connectSocket();
      console.log("Your info", res.data.data);

      toast.success("Logged in successfully");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await api.get("/auth/check");
      set({ authUser: res.data.data });
      get().connectSocket();
    } catch (err) {
      console.log("Error in checkAuth:", err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    try {
      set({ isSigningUp: true });
      const res = await api.post("/auth/signup", data);
      set({ authUser: res.data.data });
      get().connectSocket();
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      get().disconnectSocket();
      set({ authUser: null });
      toast.success("Logout successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  },
}));
