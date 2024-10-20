import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "#frontend/providers/auth-context";
import { useWebSocketContext } from "#frontend/providers/websocket-context";
import { useWebSocketContextApi } from "#frontend/providers/websocket-context";
import { LoadingSpinner } from "#frontend/components/ui/loading/spinner/spinner";

export function ProtectedRoute() {
  const { user } = useAuthContext();
  const { isSocketReady } = useWebSocketContext();
  const { connect } = useWebSocketContextApi();
  const userId = user?.id.toLocaleString();

  useEffect(() => {
    if (!userId) {
      return;
    }

    const cleanUpFn = connect(userId);

    return cleanUpFn;
  }, [userId, connect, isSocketReady]);

  return !userId ? (
    <Navigate to="/auth/login" replace />
  ) : isSocketReady ? (
    <Outlet />
  ) : (
    <LoadingSpinner />
  );
}
