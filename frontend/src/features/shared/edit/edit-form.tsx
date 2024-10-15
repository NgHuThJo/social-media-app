import { FormEvent } from "react";
import { TextArea } from "@frontend/components/ui/form/textarea/textarea";

type EditFormProps = {
  edit: (event: FormEvent<HTMLFormElement>, postId: number) => void;
  close: () => void;
  id: number;
};

export function EditForm({ edit, close, id }: EditFormProps) {
  return (
    <form action="post" onSubmit={(event) => edit(event, id)}>
      <input type="text" name="title" placeholder="New title..." />
      <TextArea name="content" placeholder="New content..." />
      <button type="submit">Edit</button>
      <button type="button" onClick={close}>
        Close form
      </button>
    </form>
  );
}
