import { FormEvent, useState } from "react";
import { useAuthContext } from "@frontend/providers/auth-context";
import { useToggle } from "@frontend/hooks/use-toggle";
import { useFetch } from "@frontend/hooks/use-fetch";
import { Button } from "@frontend/components/ui/button/button";
import { CommentForm } from "@frontend/features/shared/comment/form/form";
import { CommentList } from "../../shared/comment/list/list";
import { EditForm } from "@frontend/features/shared/edit/edit-form";
import { PostLike } from "@frontend/features/shared/post/like/like";
import { client } from "@frontend/lib/trpc";
import { formatRelativeTimeDate } from "@frontend/utils/intl";
import { PostData } from "@frontend/types/api";
import { updatePostSchema } from "@frontend/types/zod";
import styles from "./post.module.css";

type PostItemData = NonNullable<PostData>["posts"][number];

type PostProps = {
  data: PostItemData;
};

export function Post({ data: postData }: PostProps) {
  const [data, setData] = useState(postData);
  const { user } = useAuthContext();
  const { fetchData } = useFetch();
  const { isOpen: isEditing, open: openEdit, close: closeEdit } = useToggle();
  const { isOpen: isCommentOpen, toggle: toggleComment } = useToggle();
  const { isOpen: isFormOpen, open: openForm, close: closeForm } = useToggle();

  const editPost = (event: FormEvent<HTMLFormElement>, postId: number) => {
    event.preventDefault();

    fetchData(async (controller) => {
      const formData = Object.fromEntries(new FormData(event.currentTarget));
      const payload = {
        ...formData,
        postId,
      };
      const parsedData = updatePostSchema.safeParse(payload);
      console.log(parsedData);

      if (!parsedData.success) {
        throw new Error(JSON.stringify(parsedData.error.flatten()));
      }

      const response = await client.post.updatePost.mutate(parsedData.data, {
        signal: controller.signal,
      });

      if (response) {
        setData(response);
      }

      closeEdit();
    });
  };

  return (
    <>
      {data && (
        <li className={styles["post"]}>
          <div className={styles["flex-row"]}>
            <p>Author: {data.author.displayName}</p>
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
            {!isFormOpen && (
              <Button type="button" onClick={openForm}>
                Reply
              </Button>
            )}
            {data.authorId === user?.id && !isEditing && (
              <Button type="button" onClick={openEdit}>
                Edit
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
              edit={editPost}
              close={closeEdit}
              id={data.id}
              title={data.title}
              content={data.content}
            />
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
      )}
    </>
  );
}
