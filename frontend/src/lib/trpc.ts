import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "#backend/routers/api";

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_URL,
    }),
  ],
});
