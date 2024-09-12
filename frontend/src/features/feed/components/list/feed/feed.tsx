import { useToggle } from "@frontend/hooks/useToggle";
import { Button } from "@frontend/components/ui/button/button";
import { CommentList } from "@frontend/features/shared/comment/list/list";
import { CommentForm } from "@frontend/features/shared/comment/form/form";
import { formatRelativeTimeDate } from "@frontend/utils/intl";
import { FeedLoaderData } from "@frontend/app/routes/feed";
import styles from "./feed.module.css";

type FeedData = NonNullable<FeedLoaderData["data"]>[number];
type FeedProps = {
  data: FeedData;
};

export function Feed({ data }: FeedProps) {
  const { isOpen: isCommentOpen, toggle: toggleComment } = useToggle();
  const { isOpen: isFormOpen, open: openForm, close: closeForm } = useToggle();

  return (
    <li key={data.id} className={styles.item}>
      <div className={styles["flex-row"]}>
        <p>Created: {formatRelativeTimeDate(new Date(data.createdAt), "en")}</p>
        <p>Author: {data.author.name}</p>
      </div>
      <h3>{data.title}</h3>
      <p>{data.content}</p>
      <div className={styles["flex-row"]}>
        {data._count.comments > 0 && (
          <Button type="button" className="toggle" onClick={toggleComment}>
            {!isCommentOpen ? "Show comments" : "Hide comments"}
          </Button>
        )}
        <Button type="button" onClick={openForm}>
          Reply
        </Button>
      </div>
      {isFormOpen && (
        <CommentForm
          intent="postComment"
          onClose={closeForm}
          postId={data.id}
        />
      )}
      {data._count.comments > 0 && isCommentOpen && (
        <CommentList parentId={data.id} isPostId={true} />
      )}
    </li>
  );
}
