import { ProfileDetail } from "../detail/detail";
import { ProfileData } from "@frontend/app/routes/profile";
import styles from "./info.module.css";

type ProfileInfoProps = {
  data: ProfileData;
};

export function ProfileInfo({ data }: ProfileInfoProps) {
  return data ? (
    <ul className={styles.list}>
      <li className={styles.info}>
        <ProfileDetail label="Name" value={data.name} />
        <ProfileDetail label="Email" value={data.email} />
      </li>
    </ul>
  ) : null;
}
