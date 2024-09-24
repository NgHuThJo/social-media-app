import { useNavigate, useParams } from "react-router-dom";
import { useAuthContextApi } from "@frontend/providers/auth-context";
import { useWebSocketContextApi } from "@frontend/providers/websocket-context";
import { Button } from "@frontend/components/ui/button/button";

export function LogoutButton() {
  const { userId } = useParams();
  const { setUserData } = useAuthContextApi();
  const { disconnect } = useWebSocketContextApi();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!userId) {
      return;
    }

    disconnect(userId);
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
