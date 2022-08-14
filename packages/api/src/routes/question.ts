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
  list: protectedProcedure
    .input(
      z.object({
        roomId: z.string().uuid(),
        cursor: z.string().uuid().optional(),
        take: z.number().min(0),
        answered: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [questions, room] = await Promise.all([
        ctx.prisma.question.findMany({
          ...(input.cursor ? { cursor: { id: input.cursor } } : {}),
          take: input.take,
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

      return questions.map((question) => ({
        ...question,
        counts: counts.filter((entry) => entry.questionId === question.id),
        vote: votes.find((vote) => vote.questionId === question.id),
        canAnswer: room.userId === ctx.user.id,
      }));
    }),
});
