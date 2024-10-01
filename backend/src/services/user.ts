import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@backend/models";
import { AppError } from "@backend/utils/app-error";

class UserService {
  async getUser(userId: number) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        avatar: true,
      },
    });

    if (!user) {
      throw new AppError("NOT_FOUND", `No user with userId "${userId}" found`);
    }

    return user;
  }

  async followUser(userId: number, followingId: number) {
    const isFollowing = await prisma.$transaction(async (tx) => {
      const follow = await tx.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId,
          },
        },
      });

      if (!follow) {
        await tx.follow.create({
          data: {
            follower: {
              connect: {
                id: userId,
              },
            },
            following: {
              connect: {
                id: followingId,
              },
            },
          },
        });

        return true;
      }

      await tx.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId,
          },
        },
      });

      return false;
    });

    return isFollowing;
  }

  async getListOfUsers(userIdList: number[]) {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIdList,
        },
      },
      include: {
        avatar: true,
      },
    });

    return users;
  }

  async getAllUsers() {
    const users = await prisma.user.findMany({
      include: {
        avatar: true,
      },
    });

    // if (!users) {
    //   throw new AppError("NOT_FOUND", "No users found");
    // }

    return users;
  }

  async getAllOtherUsers(userId: number) {
    const otherUsers = await prisma.user.findMany({
      where: {
        NOT: {
          id: userId,
        },
      },
      include: {
        avatar: {
          select: {
            url: true,
          },
        },
        followers: {
          select: {
            id: true,
          },
        },
      },
    });

    const friendList = await prisma.user.findMany({
      where: {
        OR: [
          {
            sentFriendRequests: {
              some: {
                addresseeId: userId,
                status: "ACCEPTED",
              },
            },
          },
          {
            receivedFriendRequests: {
              some: {
                requesterId: userId,
                status: "ACCEPTED",
              },
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    const friendIdSet = new Set(friendList.map((friend) => friend.id));
    const enhancedUsers = otherUsers.map((user) => ({
      ...user,
      isFriend: friendIdSet.has(user.id),
      isFollowed: user.followers.some((follower) => follower.id === userId),
    }));

    return enhancedUsers;
  }

  async registerUser(email: string, name: string, password: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      omit: {
        password: false,
      },
    });

    if (user) {
      throw new AppError(
        "CONFLICT",
        `Email address "${email}" is already in use`,
      );
    }

    return await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
  }

  async updateUser(assetUrl: string, publicId: string, userId: number) {
    const oldAvatar = await prisma.avatar.findUnique({
      where: {
        userId,
      },
    });

    if (oldAvatar) {
      await cloudinary.uploader.destroy("uploads/" + oldAvatar.publicId);

      await prisma.avatar.delete({
        where: {
          userId,
        },
      });
    }

    const newAvatar = await prisma.avatar.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        url: assetUrl,
        publicId,
      },
    });

    const user = prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        avatar: true,
      },
    });

    if (!user) {
      throw new AppError("NOT_FOUND", `No user with id ${userId} found`);
    }

    return user;
  }
}

export const userService = new UserService();
