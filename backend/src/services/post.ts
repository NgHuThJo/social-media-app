import { prisma } from "@backend/models";
import { Cursors } from "@backend/types";
// import { AppError } from "@backend/utils/app-error";

class PostService {
  async getAllPosts(userId: number, page: number, limit: number) {
    const allPosts = await prisma.post.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        author: true,
        _count: {
          select: {
            comments: true,
          },
        },
        likes: {
          where: {
            userId,
          },
          select: {
            userId: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const likedPosts = new Map(
      allPosts.map((post) => [post.id, post.likes.map((like) => like.userId)]),
    );

    const posts = allPosts.map((post) => ({
      ...post,
      isLiked: likedPosts.get(post.id)?.some((id) => id === userId) ?? false,
    }));

    const totalPostCount = await prisma.post.count();

    return {
      posts,
      totalPages: Math.ceil(totalPostCount / limit),
      page,
    };
  }

  async togglePostLike(postId: number, userId: number) {
    const isLiked = await prisma.$transaction(async (tx) => {
      const like = await tx.postLike.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      if (!like) {
        await tx.postLike.create({
          data: {
            user: {
              connect: {
                id: userId,
              },
            },
            post: {
              connect: {
                id: postId,
              },
            },
          },
        });

        return true;
      } else {
        await tx.postLike.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });

        return false;
      }
    });

    return isLiked;
  }

  async toggleCommentLike(commentId: number, userId: number) {
    const isLiked = await prisma.$transaction(async (tx) => {
      const like = await tx.commentLike.findUnique({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      });

      if (!like) {
        await tx.commentLike.create({
          data: {
            user: {
              connect: {
                id: userId,
              },
            },
            comment: {
              connect: {
                id: commentId,
              },
            },
          },
        });

        return true;
      } else {
        await tx.commentLike.delete({
          where: {
            userId_commentId: {
              userId,
              commentId,
            },
          },
        });

        return false;
      }
    });

    return isLiked;
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

  async getParentComments(userId: number, postId: number) {
    const parentComments = await prisma.comment.findMany({
      where: {
        parentPostId: postId,
      },
      include: {
        author: true,
        _count: {
          select: {
            replies: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const likedPosts = new Map(
      parentComments.map((comment) => [
        comment.id,
        comment.likes.map((like) => like.userId),
      ]),
    );

    const enhancedComments = parentComments.map((comment) => ({
      ...comment,
      isLiked: likedPosts.get(comment.id)?.some((id) => id === userId) ?? false,
    }));

    return enhancedComments;
  }

  async getChildComments(userId: number, commentId: number) {
    const childComments = await prisma.comment.findMany({
      where: {
        parentCommentId: commentId,
      },
      include: {
        author: true,
        _count: {
          select: {
            replies: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const likedPosts = new Map(
      childComments.map((comment) => [
        comment.id,
        comment.likes.map((like) => like.userId),
      ]),
    );

    const enhancedComments = childComments.map((comment) => ({
      ...comment,
      isLiked: likedPosts.get(comment.id)?.some((id) => id === userId) ?? false,
    }));

    return enhancedComments;
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
    assetUrl: string,
    content: string,
    publicId: string,
    title: string,
    userId: number,
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
          create: { url: assetUrl, publicId },
        },
      },
      include: {
        asset: true,
        author: true,
      },
    });

    return newFeed;
  }

  async getAllFeeds(
    userId: number,
    cursors: Cursors,
    isForward: boolean,
    limit: number,
  ) {
    const takeLimit = Math.min(limit, 10);
    const cursorId = isForward ? cursors.next : cursors.back;
    const cursor = cursorId ? { id: cursorId } : undefined;
    const skip = cursor ? 1 : 0;
    const take = isForward ? takeLimit + 1 : -(takeLimit + 1);

    const feeds = await prisma.post.findMany({
      where: {
        AND: [
          // {
          //   asset: {
          //     is: null,
          //   },
          // },
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
            comments: true,
          },
        },
        likes: {
          where: {
            userId,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: [
        {
          id: "desc",
        },
      ],
      cursor,
      take,
      skip,
    });

    let hasMoreForward = false;
    let hasMoreBackward = false;
    let nextCursor: number | null = null;
    let backCursor: number | null = null;

    if (isForward) {
      if (feeds.length > takeLimit) {
        feeds.pop();
        hasMoreForward = true;
      }

      if (skip) {
        hasMoreBackward = true;
      }
    } else {
      if (feeds.length > takeLimit) {
        feeds.shift();
        hasMoreBackward = true;
      }

      if (skip) {
        hasMoreForward = true;
      }
    }

    if (feeds.length > 0) {
      nextCursor = feeds[feeds.length - 1].id;
      backCursor = feeds[0].id;
    }

    const enhancedFeeds = feeds.map((feed) => ({
      ...feed,
      isLiked: feed.likes.length > 0,
    }));

    return {
      feeds: enhancedFeeds,
      cursors: {
        nextCursor,
        backCursor,
        hasMoreForward,
        hasMoreBackward,
      },
    };
  }
}

export const postService = new PostService();
