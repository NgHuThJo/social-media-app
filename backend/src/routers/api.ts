import { router } from "./trpc";
import { authRouter } from "./auth";
import { chatRouter } from "./chat";
import { friendRouter } from "./friend";
import { postRouter } from "./post";
import { userRouter } from "./user";

export const appRouter = router({
  auth: authRouter,
  chat: chatRouter,
  friend: friendRouter,
  post: postRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
