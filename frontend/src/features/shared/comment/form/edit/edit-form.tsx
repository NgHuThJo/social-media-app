import { FormEvent } from "react";
import { Button } from "#frontend/components/ui/button/button";
import { TextArea } from "#frontend/components/ui/form/textarea/textarea";
import styles from "./edit-form.module.css";

type CommentEditFormProps = {
  edit: (event: FormEvent<HTMLFormElement>, postId: number) => void;
  close: () => void;
  id: number;
};

export function CommentEditForm({ edit, close, id }: CommentEditFormProps) {
  return (
    <form
      action="post"
      onSubmit={(event) => edit(event, id)}
      className={styles.form}
    >
      <TextArea name="content" rows={5} placeholder="New content..." />
      <div className={styles.actions}>
        <Button type="submit">Edit</Button>
        <Button type="button" onClick={close}>
          Close form
        </Button>
      </div>
    </form>
  );
}
