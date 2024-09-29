import { Navigate } from "react-router-dom";
import { useAuthContext } from "@frontend/providers/auth-context";
import { useToggle } from "@frontend/hooks/use-toggle";
import { Button } from "@frontend/components/ui/button/button";
import { CommentForm } from "@frontend/features/shared/comment/form/form";
import { CommentList } from "@frontend/features/shared/comment/list/list";
import { Follow } from "@frontend/features/shared/follow/follow";
import { Image } from "@frontend/components/ui/image/image";
import { PostLike } from "@frontend/features/shared/post/like/like";
import { formatRelativeTimeDate } from "@frontend/utils/intl";
import { FeedListItemData } from "./list/list";
import styles from "./feed.module.css";

type FeedProps = {
  data: FeedListItemData;
};

export function Feed({ data }: FeedProps) {
  const { isOpen: isCommentOpen, toggle: toggleComment } = useToggle();
  const { isOpen: isFormOpen, open: openForm, close: closeForm } = useToggle();
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/auth/login" />;
  }
  const userId = user.id.toLocaleString();

  return (
    <li key={data.id} className={styles["list-item"]}>
      <div className={styles["flex-row"]}>
        <p>Created: {formatRelativeTimeDate(new Date(data.createdAt), "en")}</p>
        <p>Author: {data.author.name}</p>
      </div>
      <h3>{data.title}</h3>
      <p>{data.content}</p>
      <Image src={data.asset?.url} alt="" />
      <div className={styles["flex-row"]}>
        {data._count.comments > 0 && (
          <Button type="button" className="toggle" onClick={toggleComment}>
            {!isCommentOpen ? "Show comments" : "Hide comments"}
          </Button>
        )}
        <Button type="button" onClick={openForm}>
          Reply
        </Button>
        <PostLike postId={data.id} likes={data._count.likes} />
        {Number(userId) !== data.authorId && (
          <Follow followingId={data.authorId} />
        )}
      </div>
      {isFormOpen && (
        <CommentForm
          intent="postComment"
          onClose={closeForm}
          parentId={data.id}
        />
      )}
      {data._count.comments > 0 && isCommentOpen && (
        <CommentList parentId={data.id} commentType="post" />
      )}
    </li>
  );
}
