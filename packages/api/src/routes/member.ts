import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { t } from '../trpc';

export const memberRouter = t.router({
  add: t.procedure
    .input(
      z.object({
        roomId: z.string().uuid(),
        email: z.string().email(),
        redirectTo: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.auth.api.inviteUserByEmail(
        input.email,
        { redirectTo: input.redirectTo },
      );

      if (error || !data) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      return ctx.prisma.member.create({
        data: { userId: data.id, roomId: input.roomId },
      });
    }),
});
