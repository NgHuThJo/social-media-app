import { useNavigate } from "react-router-dom";
import {
  useAuthContext,
  useAuthContextApi,
} from "@frontend/providers/auth-context";
import { useWebSocketContextApi } from "@frontend/providers/websocket-context";
import { Button } from "@frontend/components/ui/button/button";

export function LogoutButton() {
  const { user } = useAuthContext();
  const { setUserData } = useAuthContextApi();
  const { removeWebSocket } = useWebSocketContextApi();
  const navigate = useNavigate();
  const userId = user?.id.toLocaleString();

  const handleLogout = () => {
    removeWebSocket(userId);
    localStorage.removeItem("user");
    setUserData(undefined);

    navigate("/", {
      replace: true,
    });
  };

  return (
    <Button type="submit" className="auth" onClick={handleLogout}>
      Logout
    </Button>
  );
}
