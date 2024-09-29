import { Feed } from "../feed";
import { FeedData } from "@frontend/types/api";
import styles from "./list.module.css";

type FeedListProps = {
  data: FeedData;
};

export type FeedListItemData = NonNullable<FeedData>[number];

export function FeedList({ data }: FeedListProps) {
  if (!data || !data.length) {
    return <p>No feed available.</p>;
  }

  return (
    <ul className={styles.list}>
      {data?.map((feed) => <Feed data={feed} key={feed.id} />)}
    </ul>
  );
}
