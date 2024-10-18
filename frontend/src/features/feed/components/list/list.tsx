import { useState } from "react";
import { useAuthContext } from "@frontend/providers/auth-context";
import { useCursorPagination } from "@frontend/hooks/use-cursor-pagination";
import { Feed } from "../feed";
import { client } from "@frontend/lib/trpc";
import { FeedData } from "@frontend/types/api";
import { cursorFeedSchema } from "@frontend/types/zod";
import styles from "./list.module.css";

type FeedListProps = {
  data: FeedData;
};

export type FeedListItemData = NonNullable<FeedData>["feeds"][number];

export function FeedList({ data }: FeedListProps) {
  const [feedData, setFeedData] = useState(data?.feeds ?? []);
  const { user } = useAuthContext();
  const { isLoading, error, cursors, goToNextPage, goToPreviousPage } =
    useCursorPagination(
      async (payload, controller, setCursors) => {
        const parsedData = cursorFeedSchema.safeParse(payload);

        if (!parsedData.success) {
          throw new Error(JSON.stringify(parsedData.error.flatten()));
        }

        const response = await client.post.getAllFeeds.query(parsedData.data, {
          signal: controller.signal,
        });

        console.log(response);

        if (response?.feeds.length) {
          setFeedData(response.feeds);
          setCursors(response.cursors);
        }
      },
      { userId: user?.id.toLocaleString() },
      data?.cursors,
    );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <p>
        {error.name}: {error.message}
      </p>
    );
  }

  if (!feedData.length) {
    return <p>No feed available.</p>;
  }

  return (
    <>
      <div className={styles["button-layout"]}>
        <button
          type="button"
          onClick={goToPreviousPage}
          disabled={!cursors.hasMoreBackward}
        >
          {cursors.hasMoreBackward ? "Back" : "Already at first page"}
        </button>
        <button
          type="button"
          onClick={goToNextPage}
          disabled={!cursors.hasMoreForward}
        >
          {cursors.hasMoreForward ? "Next" : "Already at last page"}
        </button>
      </div>
      <ul className={styles.list}>
        {feedData?.map((feed) => <Feed data={feed} key={feed.id} />)}
      </ul>
    </>
  );
}
