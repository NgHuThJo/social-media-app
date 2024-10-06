import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { postService } from "@backend/services/post";
import { logError } from "@backend/utils/error-logger";
import {
  nonEmptyStringSchema,
  positiveNumberSchema,
  stringToNumberSchema,
  urlSchema,
} from "@backend/types/zod";

export const postRouter = router({
  getAllPosts: publicProcedure
    .input(
      z.object({
        userId: stringToNumberSchema,
        page: positiveNumberSchema,
        limit: positiveNumberSchema,
      }),
    )
    .query(async ({ input }) => {
      const { userId, page, limit } = input;

      try {
        const posts = await postService.getAllPosts(userId, page, limit);

        return posts;
      } catch (error) {
        logError(error);
      }
    }),

  createPost: publicProcedure
    .input(
      z.object({
        userId: stringToNumberSchema,
        title: nonEmptyStringSchema,
        content: nonEmptyStringSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { userId, title, content } = input;

      try {
        const post = await postService.createPost(userId, title, content);

        return post;
      } catch (error) {
        logError(error);
      }
    }),

  getParentComments: publicProcedure
    .input(
      z.object({
        userId: stringToNumberSchema,
        postId: stringToNumberSchema,
      }),
    )
    .query(async ({ input }) => {
      const { postId, userId } = input;

      try {
        const parentComments = await postService.getParentComments(
          userId,
          postId,
        );

        return parentComments;
      } catch (error) {
        logError(error);
      }
    }),

  getChildComments: publicProcedure
    .input(
      z.object({
        userId: stringToNumberSchema,
        commentId: stringToNumberSchema,
      }),
    )
    .query(async ({ input }) => {
      const { commentId, userId } = input;

      try {
        const childComments = await postService.getChildComments(
          userId,
          commentId,
        );

        return childComments;
      } catch (error) {
        logError(error);
      }
    }),

  createPostComment: publicProcedure
    .input(
      z.object({
        content: nonEmptyStringSchema,
        postId: stringToNumberSchema,
        userId: stringToNumberSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { content, postId, userId } = input;

      try {
        const newComment = postService.createPostComment(
          content,
          postId,
          userId,
        );

        return newComment;
      } catch (error) {
        logError(error);
      }
    }),

  createCommentReply: publicProcedure
    .input(
      z.object({
        postId: stringToNumberSchema,
        content: nonEmptyStringSchema,
        userId: stringToNumberSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { postId, content, userId } = input;

      try {
        const newComment = postService.createCommentReply(
          content,
          postId,
          userId,
        );

        return newComment;
      } catch (error) {
        logError(error);
      }
    }),

  createFeed: publicProcedure
    .input(
      z.object({
        assetUrl: urlSchema,
        content: nonEmptyStringSchema,
        publicId: nonEmptyStringSchema,
        title: nonEmptyStringSchema,
        userId: stringToNumberSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { assetUrl, content, publicId, title, userId } = input;

      try {
        const newFeed = await postService.createFeed(
          assetUrl,
          content,
          publicId,
          title,
          userId,
        );

        return newFeed;
      } catch (error) {
        logError(error);
      }
    }),

  getAllFeeds: publicProcedure
    .input(
      z.object({
        cursors: z.object({
          next: z.number().positive().nullable(),
          back: z.number().positive().nullable(),
        }),
        isForward: z.boolean(),
        limit: z.number().positive(),
        userId: stringToNumberSchema,
      }),
    )
    .query(async ({ input }) => {
      const { cursors, isForward, limit, userId } = input;

      try {
        const feeds = await postService.getAllFeeds(
          userId,
          cursors,
          isForward,
          limit,
        );

        return feeds;
      } catch (error) {
        logError(error);
      }
    }),

  getLikesOfPost: publicProcedure
    .input(
      z.object({
        postId: stringToNumberSchema,
        userId: stringToNumberSchema,
      }),
    )
    .query(async ({ input }) => {
      const { postId, userId } = input;

      const isLiked = await postService.togglePostLike(postId, userId);

      return isLiked;
    }),

  getLikesOfComment: publicProcedure
    .input(
      z.object({
        commentId: stringToNumberSchema,
        userId: stringToNumberSchema,
      }),
    )
    .query(async ({ input }) => {
      const { commentId, userId } = input;

      const isLiked = await postService.toggleCommentLike(commentId, userId);

      return isLiked;
    }),
});
