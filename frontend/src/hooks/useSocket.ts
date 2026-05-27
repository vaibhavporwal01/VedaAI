"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/services/socket";
import { useGenerationStore } from "@/features/generation/store";
import type { JobState } from "@/types";

export function useSocket() {
  const setJob = useGenerationStore((state) => state.setJob);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    const handleState = (payload: JobState) => setJob(payload);
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("job:queued", handleState);
    socket.on("job:processing", handleState);
    socket.on("job:done", handleState);
    socket.on("job:failed", handleState);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("job:queued", handleState);
      socket.off("job:processing", handleState);
      socket.off("job:done", handleState);
      socket.off("job:failed", handleState);
    };
  }, [setJob]);

  return { isConnected };
}
