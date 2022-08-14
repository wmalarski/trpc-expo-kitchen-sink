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
      const vote = await ctx.prisma.vote.findFirst({
        where: { questionId: input.questionId, userId: ctx.user.id },
      });

      if (!vote) {
        const question = await ctx.prisma.question.findFirstOrThrow({
          where: { id: input.questionId },
        });

        await ctx.prisma.member.findFirstOrThrow({
          where: { roomId: question.roomId, userId: ctx.user.id },
        });

        return ctx.prisma.vote.create({
          data: { ...input, userId: ctx.user.id },
        });
      }

      if (vote.content === input.content) {
        return ctx.prisma.vote.deleteMany({
          where: { id: vote.id, userId: ctx.user.id },
        });
      }

      return ctx.prisma.vote.updateMany({
        where: { id: vote.id, userId: ctx.user.id },
        data: { content: input.content },
      });
    }),
});
