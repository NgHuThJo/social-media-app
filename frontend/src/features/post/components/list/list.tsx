import { Post } from "@frontend/features/shared/post/post/post";
import { PostLoaderData } from "@frontend/app/routes/post";
import styles from "./list.module.css";

export function PostList({ data }: PostLoaderData) {
  return (
    <ul className={styles.list}>
      {data?.map((post) => <Post data={post} key={post.id} />)}
    </ul>
  );
}
