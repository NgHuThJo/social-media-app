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
        avatar: true,
      },
    });

    // if (!otherUsers) {
    //   throw new AppError("NOT_FOUND", "No other users found");
    // }

    return otherUsers;
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
      await cloudinary.uploader.destroy(oldAvatar.publicId);

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

    return newAvatar;
  }
}

export const userService = new UserService();
