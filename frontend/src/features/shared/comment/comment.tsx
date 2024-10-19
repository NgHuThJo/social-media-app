import { FormEvent, useState } from "react";
import { useAuthContext } from "@frontend/providers/auth-context";
import { useFetch } from "@frontend/hooks/use-fetch";
import { useToggle } from "@frontend/hooks/use-toggle";
import { Button } from "@frontend/components/ui/button/button";
import { CommentList } from "./list/list";
import { client } from "@frontend/lib/trpc";
import { formatRelativeTimeDate } from "@frontend/utils/intl";
import { CommentForm } from "./form/form";
import { CommentLike } from "./like/like";
import { CommentEditForm } from "./form/edit/edit-form";
import { CommentListData } from "./list/list";
import { Intent } from "@frontend/types";
import { updateCommentSchema } from "@frontend/types/zod";
import styles from "./comment.module.css";

type CommentData = NonNullable<CommentListData>[number];

type CommentProps = {
  data: CommentData;
  intent: Intent;
};

export function Comment({ data: commentData, intent }: CommentProps) {
  const [data, setData] = useState(commentData);
  const { user } = useAuthContext();
  const { fetchData } = useFetch();
  const { isOpen: isEditing, open: openEdit, close: closeEdit } = useToggle();
  const { isOpen: isCommentOpen, toggle: toggleComment } = useToggle();
  const { isOpen: isFormOpen, open: openForm, close: closeForm } = useToggle();

  const editComment = (
    event: FormEvent<HTMLFormElement>,
    commentId: number,
  ) => {
    event.preventDefault();

    fetchData(async (controller) => {
      const formData = Object.fromEntries(new FormData(event.currentTarget));
      const payload = {
        ...formData,
        commentId,
      };
      const parsedData = updateCommentSchema.safeParse(payload);

      if (!parsedData.success) {
        throw new Error(JSON.stringify(parsedData.error.flatten()));
      }

      const response = await client.post.updateComment.mutate(parsedData.data, {
        signal: controller.signal,
      });

      if (response) {
        setData(response);
      }

      closeEdit();
    });
  };

  return (
    <li key={data.id} className={styles.comment}>
      <div className={styles.metadata}>
        <p>Author: {data.author.displayName}</p>
        <p>Created: {formatRelativeTimeDate(new Date(data.createdAt), "en")}</p>
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
        {data.authorId === user?.id && !isEditing && (
          <Button type="button" className="auth" onClick={openEdit}>
            Edit comment
          </Button>
        )}
        <CommentLike
          commentId={data.id}
          likes={data.likes.length}
          isLiked={data.isLiked}
        />
      </div>
      {isEditing && (
        <CommentEditForm edit={editComment} close={closeEdit} id={data.id} />
      )}
      {isFormOpen && (
        <CommentForm parentId={data.id} intent={intent} onClose={closeForm} />
      )}
      {data._count.replies > 0 && isCommentOpen && (
        <CommentList parentId={data.id} commentType="comment" />
      )}
    </li>
  );
}
