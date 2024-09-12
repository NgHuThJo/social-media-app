import { ProfileLoaderData } from "@frontend/app/routes/profile";
import { ProfileDetail } from "../detail/detail";
import styles from "./info.module.css";

export function ProfileInfo({ data }: ProfileLoaderData) {
  return data ? (
    <ul className={styles.list}>
      <li className={styles.info}>
        <ProfileDetail label="Name" value={data.name} />
        <ProfileDetail label="Email" value={data.email} />
      </li>
    </ul>
  ) : null;
}
