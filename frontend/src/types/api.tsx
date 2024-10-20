import { client } from "#frontend/lib/trpc";

export type ChatroomsData = Awaited<
  ReturnType<typeof client.chat.getAllChatrooms.query>
>;

export type FeedData = Awaited<
  ReturnType<typeof client.post.getAllFeeds.query>
>;

export type FriendData = Awaited<
  ReturnType<typeof client.friend.getAllFriends.query>
>;

export type OnlineUsersData = Awaited<
  ReturnType<typeof client.user.getAllOnlineUsers.query>
>;

export type UsersData = Awaited<
  ReturnType<typeof client.user.getAllOtherUsers.query>
>;

export type PostData = Awaited<
  ReturnType<typeof client.post.getAllPosts.query>
>;

export type ProfileData = Awaited<ReturnType<typeof client.user.getUser.query>>;
