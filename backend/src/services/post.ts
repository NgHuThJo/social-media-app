import { prisma } from "@backend/models";
// import { AppError } from "@backend/utils/app-error";

class PostService {
  async getAllPosts() {
    const posts = await prisma.post.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        author: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    // if (!posts.length) {
    //   throw new AppError("NOT_FOUND", "No posts found");
    // }

    return posts;
  }

  async createPost(userId: number, title: string, content: string) {
    return await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        author: true,
      },
    });
  }

  async getParentComments(postId: number) {
    const parentComments = await prisma.comment.findMany({
      where: {
        parentPostId: postId,
      },
      include: {
        author: true,
        _count: {
          select: {
            replies: true,
            likes: true,
          },
        },
      },
    });

    // if (!parentComments.length) {
    //   throw new AppError("NOT_FOUND", "No parent comments found");
    // }

    return parentComments;
  }

  async getChildComments(commentId: number) {
    const childComments = await prisma.comment.findMany({
      where: {
        parentCommentId: commentId,
      },
      include: {
        author: true,
        _count: {
          select: {
            replies: true,
            likes: true,
          },
        },
      },
    });

    // if (!childComments.length) {
    //   throw new AppError("NOT_FOUND", "No child comments found");
    // }

    return childComments;
  }

  async createPostComment(content: string, postId: number, userId: number) {
    return await prisma.comment.create({
      data: {
        content,
        parentPost: {
          connect: {
            id: postId,
          },
        },
        author: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        author: true,
      },
    });
  }

  async createCommentReply(content: string, commentId: number, userId: number) {
    return await prisma.comment.create({
      data: {
        content,
        parentComment: {
          connect: {
            id: commentId,
          },
        },
        author: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        author: true,
      },
    });
  }

  async createFeed(
    content: string,
    title: string,
    userId: number,
    assetUrl: string,
  ) {
    const newFeed = await prisma.post.create({
      data: {
        content,
        title,
        author: {
          connect: {
            id: userId,
          },
        },
        asset: {
          create: { url: assetUrl },
        },
      },
      include: {
        asset: true,
        author: true,
      },
    });

    return newFeed;
  }

  async getAllFeeds(userId: number) {
    const feeds = await prisma.post.findMany({
      where: {
        AND: [
          {
            asset: {
              is: {},
            },
          },
          {
            OR: [
              {
                author: {
                  id: userId,
                },
              },
              {
                author: {
                  sentFriendRequests: {
                    some: {
                      addresseeId: userId,
                      status: "ACCEPTED",
                    },
                  },
                },
              },
              {
                author: {
                  receivedFriendRequests: {
                    some: {
                      requesterId: userId,
                      status: "ACCEPTED",
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      include: {
        author: true,
        asset: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // if (!feeds.length) {
    //   throw new AppError("NOT_FOUND", "No feeds found");
    // }

    return feeds;
  }
}

export const postService = new PostService();
