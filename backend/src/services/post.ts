import { prisma } from "@backend/models";
// import { AppError } from "@backend/utils/app-error";

class PostService {
  async getAllPosts(userId: number) {
    const posts = await prisma.post.findMany({
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
          select: {
            userId: true,
          },
        },
      },
    });

    const followedUsersIdList = await prisma.user.findMany({
      where: {
        follows: {
          some: {
            followerId: userId,
          },
        },
      },
      select: {
        id: true,
      },
    });
    const followedUsers = new Set(followedUsersIdList.map((user) => user.id));

    const likedPosts = new Map(
      posts.map((post) => [post.id, post.likes.map((like) => like.userId)]),
    );

    const enhancedPosts = posts.map((post) => ({
      ...post,
      isFollowed: followedUsers.has(post.authorId),
      isLiked: likedPosts?.get(post.id)?.some((id) => id === userId),
    }));

    return enhancedPosts;
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
      orderBy: {
        createdAt: "desc",
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
      orderBy: {
        createdAt: "desc",
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
