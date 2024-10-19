import { FormEvent } from "react";
import { Button } from "@frontend/components/ui/button/button";
import { Input } from "@frontend/components/ui/form/input/input";
import { TextArea } from "@frontend/components/ui/form/textarea/textarea";
import styles from "./edit-form.module.css";

type EditFormProps = {
  edit: (event: FormEvent<HTMLFormElement>, postId: number) => void;
  close: () => void;
  id: number;
  title: string;
  content: string;
};

export function EditForm({ edit, close, id, title, content }: EditFormProps) {
  return (
    <form
      action="post"
      onSubmit={(event) => edit(event, id)}
      className={styles.form}
    >
      <Input type="text" name="title" label="New title" placeholder={title} />
      <TextArea name="content" rows={5} placeholder={content} />
      <div className={styles.actions}>
        <Button type="submit">Edit</Button>
        <Button type="button" onClick={close}>
          Close form
        </Button>
      </div>
    </form>
  );
}
