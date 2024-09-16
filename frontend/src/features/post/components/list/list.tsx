import { Post } from "@frontend/features/shared/post/post/post";
import { PostData } from "@frontend/app/routes/post";
import styles from "./list.module.css";

type PostListProps = {
  data: PostData;
};

export function PostList({ data }: PostListProps) {
  return (
    <ul className={styles.list}>
      {data?.map((post) => <Post data={post} key={post.id} />)}
    </ul>
  );
}
