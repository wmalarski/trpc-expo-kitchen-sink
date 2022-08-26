import { z } from 'zod';
import { protectedProcedure, t } from '../trpc';

export const voteRouter = t.router({
  toggle: protectedProcedure
    .input(
      z.object({
        questionId: z.string().uuid(),
        content: z.string().min(1).max(32),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.prisma.question.findFirstOrThrow({
        where: { id: input.questionId },
      });

      await ctx.prisma.member.findFirstOrThrow({
        where: { roomId: question.roomId, userId: ctx.user.id },
      });

      const vote = await ctx.prisma.vote.findFirst({
        where: { questionId: input.questionId, userId: ctx.user.id },
      });

      if (vote?.content === input.content) {
        return ctx.prisma.vote.delete({
          where: { id: vote.id },
        });
      }

      return ctx.prisma.vote.upsert({
        where: {
          questionId_userId: {
            questionId: input.questionId,
            userId: ctx.user.id,
          },
        },
        create: { ...input, userId: ctx.user.id },
        update: { ...input },
      });
    }),
});
