import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const genderList = [
  "MALE",
  "FEMALE",
  "NON_BINARY",
  "OTHER",
  "PREFER_NOT_TO_SAY",
] as const;

type OmitDate<T> = Omit<T, "createdAt" | "updatedAt">;

type DbAvatar = Awaited<ReturnType<typeof prisma.avatar.create>>;
type Avatar = OmitDate<DbAvatar>;
type DbPost = Awaited<ReturnType<typeof prisma.post.create>>;
type Post = OmitDate<DbPost>;
type User = Awaited<ReturnType<typeof prisma.user.create>>;

const avatarFactory = (): Omit<Avatar, "id" | "userId"> => {
  const url = faker.image.avatar();
  const publicId = faker.internet.url();

  return {
    url,
    publicId,
  };
};

const userFactory = (): Omit<User, "id"> => {
  const gender = faker.helpers.arrayElement(genderList);
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  const displayName = faker.person.fullName({ firstName, lastName });
  const email = faker.internet
    .email({ firstName, lastName })
    .toLocaleLowerCase();
  const birthday = faker.date.birthdate();
  const password = faker.internet.password({ length: 8, memorable: true });
  const bio = faker.lorem.paragraph();

  return {
    firstName,
    lastName,
    displayName,
    email,
    birthday,
    gender,
    password,
    bio,
  };
};

const createGuest = (): Omit<User, "id"> => {
  const gender = faker.helpers.arrayElement(genderList);
  const firstName = "Joe";
  const lastName = "Doe";
  const displayName = faker.person.fullName({ firstName, lastName });
  const email = "joe.doe@gmail.com";
  const birthday = faker.date.birthdate();
  const password = "password";
  const bio = faker.lorem.paragraph();

  return {
    firstName,
    lastName,
    displayName,
    email,
    birthday,
    gender,
    password,
    bio,
  };
};

const postFactory = (): Omit<Post, "id" | "authorId"> => {
  const title = faker.lorem.lines(1);
  const content = faker.lorem.paragraphs();

  return {
    title,
    content,
  };
};

async function main() {
  const userCount = 20;
  const postCountPerUser = 2;
  const commentCountPerPost = 2;

  await prisma.user.create({
    data: {
      ...createGuest(),
      avatar: {
        create: avatarFactory(),
      },
      posts: {
        create: Array.from({ length: postCountPerUser }, () => ({
          ...postFactory(),
        })),
      },
    },
    include: {
      posts: true,
      avatar: true,
    },
  });

  console.log(`Created guest user`);

  await Promise.all(
    Array.from({ length: userCount }, async () => {
      const createdUser = await prisma.user.create({
        data: {
          ...userFactory(),
          avatar: {
            create: avatarFactory(),
          },
          posts: {
            create: Array.from({ length: postCountPerUser }, () => ({
              ...postFactory(),
            })),
          },
        },
        include: {
          posts: true,
          avatar: true,
        },
      });

      console.log(`Created user with id: ${createdUser.id}`);

      return createdUser;
    }),
  );

  const [allUsers, allPosts] = await Promise.all([
    prisma.user.findMany(),
    prisma.post.findMany(),
  ]);

  await Promise.all(
    allPosts.map(async (post) => {
      const commentPromises = Array.from(
        { length: commentCountPerPost },
        async () => {
          return prisma.comment.create({
            data: {
              content: faker.lorem.paragraph(),
              parentPost: {
                connect: {
                  id: post.id,
                },
              },
              author: {
                connect: {
                  id: faker.helpers.arrayElement(allUsers).id,
                },
              },
              likes: {
                create: {
                  user: {
                    connect: {
                      id: faker.helpers.arrayElement(allUsers).id,
                    },
                  },
                },
              },
            },
          });
        },
      );

      await prisma.postLike.create({
        data: {
          user: {
            connect: {
              id: faker.helpers.arrayElement(allUsers).id,
            },
          },
          post: {
            connect: {
              id: post.id,
            },
          },
        },
      });

      console.log(
        `Created ${commentCountPerPost} comments for postId: ${post.id}`,
      );

      return Promise.all(commentPromises);
    }),
  );

  for (let i = 0; i < allUsers.length; i++) {
    for (let j = i + 1; j < allUsers.length; j++) {
      const randomNumber = Math.random();
      const friendStatus = 3 * randomNumber;

      await prisma.friendship.create({
        data: {
          requester: {
            connect: {
              id: randomNumber < 0.5 ? i + 1 : j + 1,
            },
          },
          addressee: {
            connect: {
              id: randomNumber < 0.5 ? j + 1 : i + 1,
            },
          },
          status:
            friendStatus < 1
              ? "PENDING"
              : friendStatus < 2
                ? "ACCEPTED"
                : "DECLINED",
        },
      });

      await prisma.follow.create({
        data: {
          followedBy: {
            connect: {
              id: randomNumber < 0.5 ? i + 1 : j + 1,
            },
          },
          follows: {
            connect: {
              id: randomNumber < 0.5 ? j + 1 : i + 1,
            },
          },
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
