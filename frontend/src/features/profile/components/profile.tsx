import { formatDate } from "#frontend/utils/intl";
import { ProfileData } from "#frontend/types/api";
import styles from "./profile.module.css";
import { avatar_placeholder } from "#frontend/assets/resources/icons";
import {
  capitalizeFirstLetter,
  convertAllUnderscoresToHyphens,
} from "#frontend/utils/string";

type ProfileInfoProps = {
  data: ProfileData;
};

export function Profile({ data }: ProfileInfoProps) {
  return data ? (
    <div className={styles.profile}>
      <div data-bg></div>
      <picture className={styles.avatar}>
        <img src={data.avatar?.url || avatar_placeholder} alt="avatar" />
      </picture>
      <div className={styles.info}>
        <p data-name>{data.displayName}</p>
        <p data-name>{data.email}</p>
        {data.birthday && (
          <p data-info>{formatDate(new Date(data.birthday))}</p>
        )}
        <p data-info>First name: {data.firstName}</p>
        <p data-info>Last name: {data.lastName}</p>
        {data.gender !== null && (
          <p data-info>
            Gender:{" "}
            {capitalizeFirstLetter(
              convertAllUnderscoresToHyphens(data.gender).toLocaleLowerCase(),
            )}
          </p>
        )}
        <p data-bio>{data.bio}</p>
      </div>
    </div>
  ) : null;
}
