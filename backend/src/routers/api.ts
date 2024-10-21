import { router } from "./trpc.js";
import { authRouter } from "./auth.js";
import { chatRouter } from "./chat.js";
import { friendRouter } from "./friend.js";
import { messageRouter } from "./message.js";
import { postRouter } from "./post.js";
import { userRouter } from "./user.js";

export const appRouter = router({
  auth: authRouter,
  chat: chatRouter,
  friend: friendRouter,
  message: messageRouter,
  post: postRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
