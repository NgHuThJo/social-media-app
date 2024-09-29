import { ProfileData } from "@frontend/types/api";
import styles from "./profile.module.css";
import { avatar_placeholder, pattern } from "@frontend/assets/images";

type ProfileInfoProps = {
  data: ProfileData;
};

export function Profile({ data }: ProfileInfoProps) {
  return data ? (
    <ul
      className={styles.list}
      style={{
        backgroundImage: `url(${pattern})`,
        backgroundSize: "cover",
      }}
    >
      <img
        src={data.avatar?.url || avatar_placeholder}
        alt="avatar"
        className={styles.avatar}
      />
      <li className={styles["list-item"]}>
        <p>
          <span>Name:</span> {data.name}
        </p>
        <p>
          <span>Email:</span> {data.email}
        </p>
      </li>
    </ul>
  ) : null;
}
