import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create 10 users
  const users = await prisma.user.createMany({
    data: Array.from({ length: 10 }, (_, i) => ({
      email: `user${i + 1}@example.com`,
      name: `User ${i + 1}`,
      password: `password${i + 1}`, // In real apps, store hashed passwords
    })),
  });

  console.log("Created users:", users);

  // Fetch all users to use them in relations
  const allUsers = await prisma.user.findMany();

  // Create posts for each user
  for (const user of allUsers) {
    await prisma.post.createMany({
      data: Array.from({ length: 2 }, (_, i) => ({
        title: `Post ${i + 1} by ${user.name}`,
        content: `This is the content of post ${i + 1} by ${user.name}.`,
        authorId: user.id,
      })),
    });
  }

  // Create comments for the first post of each user
  const allPosts = await prisma.post.findMany();
  for (const post of allPosts) {
    await prisma.comment.create({
      data: {
        content: `Comment on post ${post.title}`,
        authorId: allUsers[0].id, // Let's say the first user comments on every post
        parentPostId: post.id,
      },
    });
  }

  // Create some likes on posts
  for (const post of allPosts) {
    await prisma.postLike.create({
      data: {
        userId: allUsers[1].id, // Let's say the second user likes every post
        postId: post.id,
      },
    });
  }

  // Create friendships between users
  for (let i = 0; i < allUsers.length; i++) {
    for (let j = i + 1; j < allUsers.length; j++) {
      if (Math.random() > 0.5) {
        // Randomly decide if a friendship is created
        await prisma.friendship.create({
          data: {
            requesterId: allUsers[i].id,
            addresseeId: allUsers[j].id,
            status: "ACCEPTED",
          },
        });
      }
    }
  }

  console.log("Seed data created successfully with more friendships");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
