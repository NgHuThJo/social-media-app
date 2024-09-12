import { prisma } from "@backend/models";
import { AppError } from "@backend/utils/app-error";

class UserService {
  async getUser(userId: number) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
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
    });

    return users;
  }

  async getAllUsers() {
    const users = await prisma.user.findMany();

    if (!users) {
      throw new AppError("NOT_FOUND", "No users found");
    }

    return users;
  }

  async getAllOtherUsers(userId: number) {
    const otherUsers = await prisma.user.findMany({
      where: {
        NOT: {
          id: userId,
        },
      },
    });

    if (!otherUsers) {
      throw new AppError("NOT_FOUND", "No other users found");
    }

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
}

export const userService = new UserService();
