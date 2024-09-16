import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { postService } from "@backend/services/post";
import { logError } from "@backend/utils/error-logger";
import {
  nonEmptyStringSchema,
  numericIdSchema,
} from "@backend/types/zod-schema";

export const postRouter = router({
  getAllPosts: publicProcedure.query(async () => {
    try {
      const posts = await postService.getAllPosts();

      return posts;
    } catch (error) {
      logError(error);
    }
  }),

  createPost: publicProcedure
    .input(
      z.object({
        userId: numericIdSchema,
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
        postId: numericIdSchema,
      }),
    )
    .query(async ({ input }) => {
      const { postId } = input;

      try {
        const parentComments = await postService.getParentComments(postId);

        return parentComments;
      } catch (error) {
        logError(error);
      }
    }),

  getChildComments: publicProcedure
    .input(
      z.object({
        commentId: numericIdSchema,
      }),
    )
    .query(async ({ input }) => {
      const { commentId } = input;

      try {
        const childComments = await postService.getChildComments(commentId);

        return childComments;
      } catch (error) {
        logError(error);
      }
    }),

  createPostComment: publicProcedure
    .input(
      z.object({
        content: nonEmptyStringSchema,
        postId: numericIdSchema,
        userId: numericIdSchema,
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
        postId: numericIdSchema,
        content: nonEmptyStringSchema,
        userId: numericIdSchema,
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

  getAllFeeds: publicProcedure
    .input(
      z.object({
        userId: numericIdSchema,
      }),
    )
    .query(async ({ input }) => {
      const { userId } = input;

      try {
        const feeds = await postService.getAllFeeds(userId);

        return feeds;
      } catch (error) {
        logError(error);
      }
    }),
});
