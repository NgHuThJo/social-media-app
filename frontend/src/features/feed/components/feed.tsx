import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "@frontend/providers/auth-context";
import { useFetch } from "@frontend/hooks/use-fetch";
import { useToggle } from "@frontend/hooks/use-toggle";
import { Button } from "@frontend/components/ui/button/button";
import { CommentForm } from "@frontend/features/shared/comment/form/form";
import { CommentList } from "@frontend/features/shared/comment/list/list";
import { EditForm } from "@frontend/features/shared/edit/edit-form";
import { Image } from "@frontend/components/ui/image/image";
import { PostLike } from "@frontend/features/shared/post/like/like";
import { client } from "@frontend/lib/trpc";
import { formatRelativeTimeDate } from "@frontend/utils/intl";
import { FeedListItemData } from "./list/list";
import { updatePostSchema } from "@frontend/types/zod";
import styles from "./feed.module.css";

type FeedProps = {
  data: FeedListItemData;
};

export function Feed({ data: feedData }: FeedProps) {
  const [data, setData] = useState(feedData);
  const { user } = useAuthContext();
  const { fetchData } = useFetch();
  const { isOpen: isEditing, open: openEdit, close: closeEdit } = useToggle();
  const { isOpen: isCommentOpen, toggle: toggleComment } = useToggle();
  const { isOpen: isFormOpen, open: openForm, close: closeForm } = useToggle();

  const editFeed = (event: FormEvent<HTMLFormElement>, postId: number) => {
    event.preventDefault();

    fetchData(async (controller) => {
      const formData = Object.fromEntries(new FormData(event.currentTarget));
      const payload = {
        ...formData,
        postId,
      };
      const parsedData = updatePostSchema.safeParse(payload);

      if (!parsedData.success) {
        throw new Error(JSON.stringify(parsedData.error.flatten()));
      }

      const response = await client.post.updateFeed.mutate(parsedData.data, {
        signal: controller.signal,
      });

      if (response) {
        setData(response);
      }

      closeEdit();
    });
  };

  return (
    <li key={data.id} className={styles["list-item"]}>
      <div className={styles["flex-row"]}>
        <p>
          Author:{" "}
          {data.authorId !== user?.id ? (
            <Link to={`../profile/${String(data.authorId)}`}>
              {data.author.displayName}
            </Link>
          ) : (
            data.author.displayName
          )}
        </p>
        <p>Created: {formatRelativeTimeDate(new Date(data.createdAt), "en")}</p>
      </div>
      <h3>{data.title}</h3>
      <p>{data.content}</p>
      {data.asset?.url && <Image src={data.asset.url} alt="" />}
      <div className={styles["flex-row"]}>
        {data._count.comments > 0 && (
          <Button type="button" className="toggle" onClick={toggleComment}>
            {!isCommentOpen ? "Show comments" : "Hide comments"}
          </Button>
        )}
        <Button type="button" onClick={openForm}>
          Reply
        </Button>
        {data.authorId === user?.id && !isEditing && (
          <Button type="button" className="auth" onClick={openEdit}>
            Edit feed
          </Button>
        )}
        <PostLike
          postId={data.id}
          likes={data.likes.length}
          isLiked={data.isLiked}
        />
      </div>
      {isEditing && (
        <EditForm
          edit={editFeed}
          close={closeEdit}
          id={data.id}
          title={data.title}
          content={data.content}
        ></EditForm>
      )}
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
