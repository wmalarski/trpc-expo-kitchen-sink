import { z } from 'zod';
import { protectedProcedure, t } from '../trpc';

export const questionRouter = t.router({
  add: protectedProcedure
    .input(
      z.object({
        roomId: z.string().uuid(),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.member.findFirstOrThrow({
        where: { userId: ctx.user.id, roomId: input.roomId },
      });

      return ctx.prisma.question.create({
        data: { ...input, userId: ctx.user.id },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.deleteMany({
        where: {
          id: input.id,
          OR: {
            userId: ctx.user.id,
            room: { userId: ctx.user.id },
          },
        },
      });
    }),
  answer: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        answered: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.question.update({
        where: { id: input.id },
        data: { answered: input.answered },
      });
    }),
  get: protectedProcedure
    .input(
      z.object({
        questionId: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const question = await ctx.prisma.question.findFirstOrThrow({
        where: {
          id: input.questionId,
        },
      });

      // await ctx.prisma.member.findFirstOrThrow({
      //   where: {
      //     userId: ctx.user.id,
      //     roomId: question.roomId,
      //   },
      // });

      const [counts, vote] = await Promise.all([
        ctx.prisma.vote.groupBy({
          by: ['content', 'questionId'],
          _count: true,
          where: {
            questionId: input.questionId,
          },
        }),
        ctx.prisma.vote.findFirst({
          where: {
            userId: ctx.user.id,
            questionId: input.questionId,
          },
        }),
      ]);

      return { ...question, counts, vote: vote || undefined };
    }),
  list: protectedProcedure
    .input(
      z.object({
        roomId: z.string().uuid(),
        cursor: z.string().uuid().optional(),
        take: z.number().min(1).max(100),
        answered: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [questions, room] = await Promise.all([
        ctx.prisma.question.findMany({
          cursor: input.cursor ? { id: input.cursor } : undefined,
          take: input.take + 1,
          orderBy: { votes: { _count: 'desc' } },
          where: {
            answered: input.answered,
            roomId: input.roomId,
            room: {
              members: { some: { userId: ctx.user.id } },
            },
          },
        }),
        ctx.prisma.room.findFirstOrThrow({
          where: { id: input.roomId },
          select: { userId: true },
        }),
      ]);

      const questionsIds = questions.map((question) => question.id);

      const [counts, votes] = await Promise.all([
        ctx.prisma.vote.groupBy({
          by: ['content', 'questionId'],
          _count: true,
          where: {
            questionId: {
              in: questionsIds,
            },
          },
        }),
        ctx.prisma.vote.findMany({
          where: {
            userId: ctx.user.id,
            questionId: {
              in: questionsIds,
            },
          },
        }),
      ]);

      const updated = questions.map((question) => ({
        ...question,
        counts: counts.filter((entry) => entry.questionId === question.id),
        vote: votes.find((vote) => vote.questionId === question.id),
      }));

      return {
        cursor: updated.length > input.take ? updated.pop()?.id : undefined,
        questions: updated,
        canAnswer: room.userId === ctx.user.id,
      };
    }),
});
