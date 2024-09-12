import { z } from "zod";
import { authService } from "@backend/services/auth";
import { logError } from "@backend/utils/error-logger";
import { publicProcedure, router } from "./trpc";

export const authRouter = router({
  loginUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const user = await authService.loginUser(input.email, input.password);

        return user;
      } catch (error) {
        logError(error);
      }
    }),
});
