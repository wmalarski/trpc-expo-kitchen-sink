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
  list: protectedProcedure
    .input(
      z.object({
        roomId: z.string().uuid(),
        cursor: z.string().uuid(),
        take: z.number().min(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const questions = await ctx.prisma.question.findMany({
        cursor: { id: input.cursor },
        take: input.take,
        orderBy: { votes: { _count: 'desc' } },
        where: {
          roomId: input.roomId,
          room: {
            members: { some: { userId: ctx.user.id } },
          },
        },
      });

      const questionsIds = questions.map((question) => question.id);

      const counts = await ctx.prisma.vote.groupBy({
        by: ['content', 'questionId'],
        _count: true,
        where: {
          questionId: {
            in: questionsIds,
          },
        },
      });

      return questions.map((question) => ({
        ...question,
        votes: counts.filter((entry) => entry.questionId === question.id) || [],
      }));
    }),
});
