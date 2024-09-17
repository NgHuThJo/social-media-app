import { Suspense } from "react";
import { Await, defer, useLoaderData } from "react-router-dom";
import { ChatLayout } from "@frontend/features/chat/components/layout/layout";
import { LoadingSpinner } from "@frontend/components/ui/loading/spinner/spinner";
import { client } from "@frontend/lib/trpc";
import { handleError } from "@frontend/utils/error-handling";
import { LoaderData } from "@frontend/types";

type ChatLoaderData = LoaderData<typeof chatLoader>;

export type OnlineUsersData = Awaited<
  ReturnType<typeof client.user.getListOfUsers.query>
>;

export type ChatroomsData = Awaited<
  ReturnType<typeof client.chat.getAllChatrooms.query>
>;

export const chatLoader = async () => {
  const chatroomFn = async () => {
    const chatrooms = await client.chat.getAllChatrooms.query();
    return chatrooms;
  };

  const onlineUsersFn = async () => {
    const onlineUsers = await client.user.getAllOnlineUsers.query();
    return onlineUsers;
  };

  try {
    const data = Promise.all([chatroomFn(), onlineUsersFn()]);

    return defer({ data });
  } catch (error) {
    throw new Response(
      JSON.stringify(handleError(error, "Could not fetch feed data")),
      {
        status: 500,
        statusText: "Internal Server Error",
      },
    );
  }
};
export function ChatRoute() {
  const loaderData = useLoaderData() as ChatLoaderData;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Await resolve={loaderData.data}>
        {([chatroomsData, onlineUsersData]) => (
          <ChatLayout
            chatroomsData={chatroomsData}
            onlineUsersData={onlineUsersData}
          />
        )}
      </Await>
    </Suspense>
  );
}
