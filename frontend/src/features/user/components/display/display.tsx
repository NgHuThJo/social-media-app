import { Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "@frontend/providers/auth-context";
import { Image } from "@frontend/components/ui/image/image";
import styles from "./display.module.css";
import { avatar_placeholder } from "@frontend/assets/images";

export function UserDisplay() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/auth/login" />;
  }
  const userId = user.id.toLocaleString();

  const handleClick = () => {
    navigate(`/${userId}/settings`);
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleClick} className={styles.avatar}>
        <Image
          src={user.avatar?.url ?? avatar_placeholder}
          alt="User avatar"
          className="icon"
        />
      </button>
      <p className={styles.name}>{user?.name}</p>
      <p className={styles.email}>{user?.email}</p>
    </div>
  );
}
