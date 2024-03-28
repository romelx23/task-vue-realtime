import { ref, watch } from "vue";
import { io, Socket } from "socket.io-client";
// import type { SocketIOClient } from "@types/socket.io";

export function useSocket() {
  const socket = ref<Socket | null>(null);

  const connect = (url: string) => {
    console.log("connecting", url);
    socket.value = io(url, {
      transports: ["websocket", "polling", "flashsocket"],
      rememberUpgrade: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      autoConnect: true,
      timeout: 10000,
      forceNew: true,
      multiplex: true,
      upgrade: false,
    });
  };

  const disconnect = () => {
    if (socket.value) {
      console.log("disconnecting");
      socket.value.disconnect();
      socket.value = null;
    }
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    if (socket.value) {
      console.log("listening", event);
      socket.value.on(event, callback);
    }
  };

  const emit = (event: string, data: any) => {
    if (socket.value) {
      console.log("emitting", event, data);
      socket.value.emit(event, data);
    }
  };

  watch(socket, (newSocket, oldSocket) => {
    if (oldSocket) {
      console.log("disconnecting old socket");
      oldSocket.disconnect();
    }
  });

  return {
    socket,
    connect,
    disconnect,
    on,
    emit,
  };
}
