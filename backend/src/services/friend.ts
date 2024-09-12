import { prisma } from "@backend/models";
import { AppError } from "@backend/utils/app-error";

class FriendService {
  async getAllFriends(userId: number) {
    const friendships = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: {
        requester: true,
        addressee: true,
      },
    });

    if (!friendships.length) {
      throw new AppError(
        "NOT_FOUND",
        `No friends with userId "${userId}" associated`,
      );
    }

    const friends = friendships.map((friendship) =>
      friendship.requesterId === userId
        ? friendship.addressee
        : friendship.requester,
    );

    return friends;
  }
}

export const friendService = new FriendService();
