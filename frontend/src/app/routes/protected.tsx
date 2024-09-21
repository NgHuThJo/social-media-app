import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@frontend/providers/auth-context";
import { useWebSocketContextApi } from "@frontend/providers/websocket-context";

export function ProtectedRoute() {
  const { user } = useAuthContext();
  const { createWebSocket } = useWebSocketContextApi();
  const userId = user?.id.toLocaleString();

  useEffect(() => {
    if (!userId) {
      return;
    }

    const cleanUpFn = createWebSocket(userId);

    return cleanUpFn;
  }, []);

  return userId ? <Outlet /> : <Navigate to="/auth/login" replace />;
}
