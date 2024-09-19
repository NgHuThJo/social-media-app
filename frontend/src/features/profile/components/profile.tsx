import { ProfileDetail } from "./detail/detail";
import { ProfileData } from "@frontend/types/api";
import styles from "./profile.module.css";

type ProfileInfoProps = {
  data: ProfileData;
};

export function Profile({ data }: ProfileInfoProps) {
  return data ? (
    <ul className={styles.list}>
      <li className={styles["list-item"]}>
        <ProfileDetail label="Name" value={data.name} />
        <ProfileDetail label="Email" value={data.email} />
      </li>
    </ul>
  ) : null;
}
