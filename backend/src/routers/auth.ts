import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { authService } from "@backend/services/auth";
import { logError } from "@backend/utils/error-logger";
import { emailSchema, passwordSchema } from "@backend/utils/zod-schema";

export const authRouter = router({
  loginUser: publicProcedure
    .input(
      z.object({
        email: emailSchema,
        password: passwordSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { email, password } = input;

      try {
        const user = await authService.loginUser(email, password);

        return user;
      } catch (error) {
        logError(error);
      }
    }),
});
