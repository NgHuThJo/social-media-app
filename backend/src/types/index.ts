export type FriendRequestAction =
  | "SEND_REQUEST"
  | "ACCEPT_REQUEST"
  | "DECLINE_REQUEST"
  | "REMOVE_FRIEND";

export type Gender =
  | "MALE"
  | "FEMALE"
  | "NON_BINARY"
  | "OTHER"
  | "PREFER_NOT_TO_SAY";

export type Cursors = {
  next: number | null;
  back: number | null;
};

export type Cursor = {
  id: number;
  hasMore: boolean;
};
