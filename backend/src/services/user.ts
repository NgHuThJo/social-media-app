import { v2 as cloudinary } from "cloudinary";
import { prisma } from "#backend/models/index.js";
import { AppError } from "#backend/utils/app-error.js";
import { Cursor } from "#backend/types/index.js";

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

  async followUser(userId: number, followsId: number) {
    const isFollowed = await prisma.$transaction(async (tx) => {
      const follow = await tx.follow.findUnique({
        where: {
          followedById_followsId: {
            followedById: userId,
            followsId,
          },
        },
      });

      if (!follow) {
        await tx.follow.create({
          data: {
            followedBy: {
              connect: {
                id: userId,
              },
            },
            follows: {
              connect: {
                id: followsId,
              },
            },
          },
        });

        return true;
      }

      await tx.follow.delete({
        where: {
          followedById_followsId: {
            followedById: userId,
            followsId,
          },
        },
      });

      return false;
    });

    return isFollowed;
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

  async getAllOtherUsers(
    userId: number,
    cursorItem: Cursor | null,
    limit: number,
  ) {
    const cursor = cursorItem
      ? {
          id: cursorItem.id,
        }
      : undefined;
    const takeLimit = Math.min(limit, 10);
    const take = takeLimit + 1;
    const skip = cursor ? 1 : 0;

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
        follows: true,
        friendRequestTo: {
          where: {
            addresseeId: userId,
          },
          select: {
            status: true,
          },
        },
        friendRequestFrom: {
          where: {
            requesterId: userId,
          },
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
      skip,
      take,
      cursor,
    });

    let hasMore = false;
    let nextCursor = null;

    if (otherUsers.length > takeLimit) {
      hasMore = true;
      otherUsers.pop();
      nextCursor = otherUsers[otherUsers.length - 1].id;
    }

    const enhancedUsers = otherUsers.map((user) => {
      let friendshipStatus;
      let isCurrentUserSender;

      if (user.friendRequestTo.length > 0) {
        friendshipStatus = user.friendRequestTo[0].status;
        isCurrentUserSender = false;
      } else if (user.friendRequestFrom.length > 0) {
        friendshipStatus = user.friendRequestFrom[0].status;
        isCurrentUserSender = true;
      } else {
        friendshipStatus = null;
        isCurrentUserSender = null;
      }

      const {
        friendRequestTo: _friendRequestTo,
        friendRequestFrom: _friendRequestFrom,
        follows: _follows,
        ...rest
      } = user;

      return {
        ...rest,
        friendshipStatus,
        isCurrentUserSender,
        isFollowed: user.follows.some(
          (follows) => follows.followedById === userId,
        ),
      };
    });

    return {
      index: enhancedUsers,
      cursor: nextCursor
        ? {
            hasMore,
            id: nextCursor,
          }
        : null,
    };
  }

  async registerUser(
    email: string,
    firstName: string,
    lastName: string,
    displayName: string,
    password: string,
  ) {
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
        firstName,
        lastName,
        displayName,
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

    await prisma.avatar.create({
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
