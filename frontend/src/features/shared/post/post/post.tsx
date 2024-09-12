import { PostLoaderData } from "@frontend/app/routes/post";
import { useToggle } from "@frontend/hooks/useToggle";
import { Button } from "@frontend/components/ui/button/button";
import { CommentForm } from "../../comment/form/form";
import { CommentList } from "../../comment/list/list";
import { formatRelativeTimeDate } from "@frontend/utils/intl";
import styles from "./post.module.css";

type PostProps = {
  data: NonNullable<PostLoaderData["data"]>[number];
};

export function Post({ data }: PostProps) {
  const { isOpen: isCommentOpen, toggle: toggleComment } = useToggle();
  const { isOpen: isFormOpen, open: openForm, close: closeForm } = useToggle();

  return (
    <>
      {data && (
        <li className={styles["post"]}>
          <div className={styles["flex-row"]}>
            <p>Author: {data.author.name}</p>
            <p>
              Created: {formatRelativeTimeDate(new Date(data.createdAt), "en")}
            </p>
          </div>
          <h3>{data.title}</h3>
          <p>{data.content}</p>
          <div className={styles["flex-row"]}>
            {data._count.comments > 0 && (
              <Button type="button" onClick={toggleComment}>
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
      )}
    </>
  );
}
