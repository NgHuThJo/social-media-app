import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@frontend/providers/auth-context";
import { useWebSocketContextApi } from "@frontend/providers/websocket-context";

export function ProtectedRoute() {
  const { userId } = useAuthContext();
  const { createWebSocket } = useWebSocketContextApi();

  useEffect(() => {
    if (!userId) {
      return;
    }

    const cleanUpFn = createWebSocket(userId);

    return cleanUpFn;
  }, []);

  return userId ? <Outlet /> : <Navigate to="/auth/login" replace />;
}
