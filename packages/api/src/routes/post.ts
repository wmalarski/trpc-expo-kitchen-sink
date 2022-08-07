import { z } from 'zod';
import { t } from '../trpc';

export const postRouter = t.router({
  add: t.procedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        title: z.string().min(1).max(32),
        text: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.post.create({
        data: input,
      });
      return todo;
    }),
  list: t.procedure.query(async ({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  get: t.procedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.post.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });
    }),
});
