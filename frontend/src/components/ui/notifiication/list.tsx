import { useEffect, useRef, useState } from "react";
import { useWebSocketContextApi } from "@frontend/providers/websocket-context";
import { Button } from "../button/button";
import { Image } from "../image/image";
import styles from "./list.module.css";
import { notification_icon } from "@frontend/assets/images";

export function NotificationList() {
  const [notifications, setNotifications] = useState<string[]>([]);
  const notificationListRef = useRef<HTMLUListElement>(null);
  const { addNotification } = useWebSocketContextApi();

  useEffect(() => {
    const cleanupFn = addNotification(setNotifications);

    return cleanupFn;
  }, []);

  const toggleNotification = () => {
    if (!notificationListRef.current) {
      return;
    }

    if (notificationListRef.current.classList.contains("slide-in")) {
      notificationListRef.current.classList.remove("slide-in");
      notificationListRef.current.classList.add("slide-out");
    } else {
      notificationListRef.current.classList.remove("slide-out");
      notificationListRef.current.classList.add("slide-in");
    }
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.filter((_item, index) => index !== id));
  };

  return (
    <>
      <button
        type="button"
        className={styles.bell}
        onClick={toggleNotification}
      >
        <Image className="icon" src={notification_icon} />
        <span>{notifications.length}</span>
      </button>
      <ul className={styles.container} ref={notificationListRef}>
        {notifications.length ? (
          notifications.map((notification, index) => (
            <li className={styles.notification} key={index}>
              <p>{notification}</p>
              <Button type="button" onClick={() => markAsRead(index)}>
                Mark as read
              </Button>
            </li>
          ))
        ) : (
          <li>No notifications.</li>
        )}
      </ul>
    </>
  );
}
