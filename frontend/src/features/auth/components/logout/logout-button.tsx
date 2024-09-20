import { useNavigate } from "react-router-dom";
import {
  useAuthContext,
  useAuthContextApi,
} from "@frontend/providers/auth-context";
import { useWebSocketContextApi } from "@frontend/providers/websocket-context";
import { Button } from "@frontend/components/ui/button/button";

export function LogoutButton() {
  const { userId } = useAuthContext();
  const authContextApi = useAuthContextApi();
  const webSocketContextApi = useWebSocketContextApi();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    authContextApi?.setUserId("");
    webSocketContextApi.removeWebSocket(userId);

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
