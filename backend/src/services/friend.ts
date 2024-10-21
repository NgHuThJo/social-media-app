import { prisma } from "#backend/models/index.js";
import { FriendRequestAction } from "#backend/types/index.js";
import { FriendshipStatus } from "@prisma/client";

class FriendService {
  async getAllFriends(userId: number) {
    const friendships = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: {
        requester: {
          include: {
            avatar: true,
          },
        },
        addressee: {
          include: {
            avatar: true,
          },
        },
      },
    });

    const friends = friendships.map((friendship) =>
      friendship.requesterId === userId
        ? friendship.addressee
        : friendship.requester,
    );

    return friends;
  }

  async updateFriendship(
    userId: number,
    friendId: number,
    action: FriendRequestAction,
  ) {
    const friendshipStatus: {
      friendshipStatus: FriendshipStatus | null;
      isCurrentUserSender: boolean | null;
    } = await prisma.$transaction(async (tx) => {
      switch (action) {
        case "SEND_REQUEST": {
          {
            await tx.friendship.upsert({
              where: {
                requesterId_addresseeId: {
                  requesterId: userId,
                  addresseeId: friendId,
                },
              },
              update: {
                status: FriendshipStatus.PENDING,
              },
              create: {
                requester: {
                  connect: {
                    id: userId,
                  },
                },
                addressee: {
                  connect: {
                    id: friendId,
                  },
                },
              },
            });
          }

          return {
            friendshipStatus: "PENDING",
            isCurrentUserSender: true,
          };
        }
        case "REMOVE_FRIEND": {
          await tx.friendship.deleteMany({
            where: {
              OR: [
                {
                  requesterId: userId,
                  addresseeId: friendId,
                },
                {
                  requesterId: friendId,
                  addresseeId: userId,
                },
              ],
            },
          });

          return {
            friendshipStatus: null,
            isCurrentUserSender: null,
          };
        }
        case "ACCEPT_REQUEST": {
          await tx.friendship.updateMany({
            where: {
              requesterId: friendId,
              addresseeId: userId,
            },
            data: {
              status: "ACCEPTED",
            },
          });

          return {
            friendshipStatus: "ACCEPTED",
            isCurrentUserSender: false,
          };
        }
        case "DECLINE_REQUEST": {
          await tx.friendship.updateMany({
            where: {
              requesterId: friendId,
              addresseeId: userId,
            },
            data: {
              status: "DECLINED",
            },
          });

          return {
            friendshipStatus: "DECLINED",
            isCurrentUserSender: false,
          };
        }
      }
    });

    return friendshipStatus;
  }
}

export const friendService = new FriendService();
