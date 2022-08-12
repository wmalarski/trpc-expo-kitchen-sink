import { z } from 'zod';
import { protectedProcedure, t } from '../trpc';

export const voteRouter = t.router({
  add: protectedProcedure
    .input(
      z.object({
        questionId: z.string().uuid(),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.question.findFirstOrThrow({
        where: {
          id: input.questionId,
          room: { members: { some: { id: ctx.user.id } } },
        },
      });

      return ctx.prisma.vote.create({
        data: { ...input, userId: ctx.user.id },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        content: z.string().min(1).max(32),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.vote.updateMany({
        where: { id: input.id, userId: ctx.user.id },
        data: { content: input.content },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.room.deleteMany({
        where: { id: input.id, userId: ctx.user.id },
      });
    }),
});
