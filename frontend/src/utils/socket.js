import { io } from "socket.io-client";

export const socket = async () => {
  const options = {
    "force new connection": true,
    allowEIO3: true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

  return io("ws://localhost:5001", options);
};
