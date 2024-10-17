import { useEffect, useState } from "react";
import { useFetch } from "@frontend/hooks/use-fetch";
import { useParams } from "react-router-dom";
import { client } from "@frontend/lib/trpc";
import {
  capitalizeFirstLetter,
  convertAllUnderscoresToHyphens,
} from "@frontend/utils/string";
import { formatDate } from "@frontend/utils/intl";
import { ProfileData } from "@frontend/types/api";
import { userIdSchema } from "@frontend/types/zod";
import styles from "./public-profile.module.css";
import { avatar_placeholder } from "@frontend/assets/resources/icons";

export function PublicProfile() {
  const [data, setData] = useState<ProfileData>();
  const { profileId } = useParams();
  const { fetchData } = useFetch();

  useEffect(() => {
    fetchData(async (controller) => {
      if (!profileId) {
        return;
      }

      const payload = {
        userId: profileId,
      };

      const parsedData = userIdSchema.safeParse(payload);

      if (!parsedData.success) {
        throw new Error("Invalid userId");
      }

      const response = await client.user.getUser.query(parsedData.data, {
        signal: controller.signal,
      });

      if (response) {
        setData(response);
      }
    });
  });

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
