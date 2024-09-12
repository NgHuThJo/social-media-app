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

  const onLogout = () => {
    webSocketContextApi.removeWebSocket(userId);
    authContextApi?.setUserId("");
    localStorage.removeItem("userId");

    navigate("/", {
      replace: true,
    });
  };

  return (
    <Button type="submit" className="auth" onClick={onLogout}>
      Logout
    </Button>
  );
}
