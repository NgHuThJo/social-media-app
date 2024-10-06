export type FriendRequestAction =
  | "SEND_REQUEST"
  | "ACCEPT_REQUEST"
  | "DECLINE_REQUEST"
  | "REMOVE_FRIEND";

export type Cursors = {
  next: number | null;
  back: number | null;
};
