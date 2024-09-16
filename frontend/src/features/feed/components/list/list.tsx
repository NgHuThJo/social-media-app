import { Feed } from "./feed/feed";
import { FeedData } from "@frontend/app/routes/feed";
import styles from "./list.module.css";

type FeedListProps = {
  data: FeedData;
};

export function FeedList({ data }: FeedListProps) {
  return (
    <ul className={styles.list}>
      {data?.map((feed) => <Feed data={feed} key={feed.id} />)}
    </ul>
  );
}
