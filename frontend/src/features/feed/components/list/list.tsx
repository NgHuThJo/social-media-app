import { Feed } from "./feed/feed";
import { FeedLoaderData } from "@frontend/app/routes/feed";
import styles from "./list.module.css";

export function FeedList({ data }: FeedLoaderData) {
  return (
    <ul className={styles.list}>
      {data?.map((feed) => <Feed data={feed} key={feed.id} />)}
    </ul>
  );
}
