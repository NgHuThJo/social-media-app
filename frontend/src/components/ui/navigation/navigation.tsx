import { Link } from "react-router-dom";
import { useAuthContext } from "@frontend/providers/auth-context";
import { LogoutButton } from "@frontend/features/auth/components/logout/logout-button";
import { NavigationLink } from "./link/link";
import { NavigationList } from "./list/list";
import { NotificationList } from "../notifiication/list";
import { UserDisplay } from "@frontend/features/user/components/display/display";
import styles from "./navigation.module.css";

export function Navigation() {
  const { userId } = useAuthContext();

  return (
    <nav className={styles.container}>
      <Link to="/" className={styles.logo}>
        Social media app
      </Link>
      {userId && <NavigationList />}
      <div className={styles["flex-row"]}>
        {!userId ? (
          <NavigationLink to="/auth/login">Login</NavigationLink>
        ) : (
          <>
            <UserDisplay />
            <LogoutButton />
            <NotificationList />
          </>
        )}
      </div>
    </nav>
  );
}
