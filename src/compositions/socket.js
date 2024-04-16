import { io } from "socket.io-client";
import { useAuthStore } from "../stores/auth";

export const useSocketIO = () => {
  const authStore = useAuthStore();
  const socket = io(import.meta.env.VITE_API_URL, {
    auth: {
      token: authStore.token,
    },
    withCredentials: true,
    transports: ["websocket"],
  });
  
  return {
    socket,
  }
}