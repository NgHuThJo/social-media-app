import { z } from "zod";
import { postService } from "@backend/services/post";
import { logError } from "@backend/utils/error-logger";
import { publicProcedure, router } from "./trpc";

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
        userId: z.number().gt(0),
        title: z.string().min(1),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const { userId, title, content } = input;

      try {
        const friends = await postService.createPost(userId, title, content);

        return friends;
      } catch (error) {
        logError(error);
      }
    }),

  getParentComments: publicProcedure
    .input(z.number().gt(0))
    .query(async ({ input }) => {
      try {
        const parentComments = await postService.getParentComments(input);

        return parentComments;
      } catch (error) {
        logError(error);
      }
    }),

  getChildComments: publicProcedure
    .input(z.number().gt(0))
    .query(async ({ input }) => {
      try {
        const childComments = await postService.getChildComments(input);

        return childComments;
      } catch (error) {
        logError(error);
      }
    }),

  createPostComment: publicProcedure
    .input(
      z.object({
        content: z.string().min(1),
        postId: z.number().gt(0),
        userId: z.number().gt(0),
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
        content: z.string().min(1),
        postId: z.number().gt(0),
        userId: z.number().gt(0),
      }),
    )
    .mutation(async ({ input }) => {
      const { content, postId, userId } = input;

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
    .input(z.number().gt(0))
    .query(async ({ input }) => {
      try {
        const feeds = await postService.getAllFeeds(input);

        return feeds;
      } catch (error) {
        logError(error);
      }
    }),
});
