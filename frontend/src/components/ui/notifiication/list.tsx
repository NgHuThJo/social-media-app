import { useEffect, useRef, useState } from "react";
import { useWebSocketContextApi } from "@frontend/providers/websocket-context";
import { Button } from "../button/button";
import { Image } from "../image/image";
import styles from "./list.module.css";
import { notification_icon } from "@frontend/assets/resources/icons";

export function NotificationList() {
  const [notifications, setNotifications] = useState<string[]>([]);
  const notificationListRef = useRef<HTMLUListElement>(null);
  const { subscribe } = useWebSocketContextApi();

  useEffect(() => {
    const unsubscribe = subscribe("notification", (data: string) => {
      console.log("user notification", data);
      setNotifications((prev) => [...prev, data]);
    });

    return unsubscribe;
  }, []);

  const toggleNotification = () => {
    if (!notificationListRef.current) {
      return;
    }

    const isSlideIn = notificationListRef.current.classList.toggle("slide-in");

    if (isSlideIn) {
      notificationListRef.current.classList.remove("slide-out");
    } else {
      notificationListRef.current.classList.add("slide-out");
    }
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.filter((_item, index) => index !== id));
  };

  const markAllAsRead = () => {
    setNotifications([]);
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
        {notifications.length ? (
          <Button onClick={markAllAsRead}>Mark all as read</Button>
        ) : null}
      </ul>
    </>
  );
}
