import { useToggle } from "@frontend/hooks/use-toggle";
import { Button } from "@frontend/components/ui/button/button";
import { CommentList } from "../list/list";
import { formatRelativeTimeDate } from "@frontend/utils/intl";
import { CommentForm } from "../form/form";
import { CommentListData } from "../list/list";
import { Intent } from "@frontend/types";
import styles from "./comment.module.css";

type CommentData = NonNullable<CommentListData>[number];

type CommentProps = {
  data: CommentData;
  intent: Intent;
};

export function Comment({ data, intent }: CommentProps) {
  const { isOpen: isCommentOpen, toggle: toggleComment } = useToggle();
  const { isOpen: isFormOpen, open: openForm, close: closeForm } = useToggle();

  return (
    <li key={data.id} className={styles.comment}>
      <div className={styles.metadata}>
        <p>{data.author.name}</p>
        <p>{formatRelativeTimeDate(new Date(data.createdAt), "en")}</p>
      </div>
      <p>{data.content}</p>
      <div className={styles.options}>
        {data._count.replies > 0 && (
          <Button type="button" onClick={toggleComment}>
            {!isCommentOpen ? "Show comments" : "Hide comments"}
          </Button>
        )}
        <Button type="button" onClick={openForm}>
          Reply
        </Button>
      </div>
      {isFormOpen && (
        <CommentForm parentId={data.id} intent={intent} onClose={closeForm} />
      )}
      {data._count.replies > 0 && isCommentOpen && (
        <CommentList parentId={data.id} commentType="comment" />
      )}
    </li>
  );
}
