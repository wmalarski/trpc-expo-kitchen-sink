import { z } from 'zod';
import { protectedProcedure, t } from '../trpc';

export const roomRouter = t.router({
  add: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(32),
        description: z.string().min(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.prisma.room.create({
        data: { ...input, userId: ctx.user.id },
      });
      const member = await ctx.prisma.member.create({
        data: { userId: ctx.user.id, roomId: room.id },
      });
      return { room, member };
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1).max(32),
        description: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.room.updateMany({
        where: { id: input.id, userId: ctx.user.id },
        data: { title: input.title, description: input.description },
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
  list: protectedProcedure
    .input(
      z.object({
        cursor: z.string().uuid().nullable().optional(),
        take: z.number().min(1).max(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      const rooms = await ctx.prisma.room.findMany({
        cursor: input.cursor ? { id: input.cursor } : undefined,
        take: input.take + 1,
        orderBy: { createdAt: 'asc' },
        where: { members: { some: { userId: ctx.user.id } } },
      });

      return {
        cursor: rooms.length > input.take ? rooms.pop()?.id : undefined,
        rooms,
      };
    }),
  page: protectedProcedure
    .input(
      z.object({
        skip: z.number().min(0),
        take: z.number().min(1).max(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [rooms, count] = await Promise.all([
        ctx.prisma.room.findMany({
          skip: input.skip,
          take: input.take,
          orderBy: { createdAt: 'asc' },
          where: { members: { some: { userId: ctx.user.id } } },
        }),
        ctx.prisma.room.count({
          where: { members: { some: { userId: ctx.user.id } } },
        }),
      ]);

      return { count, rooms };
    }),
  get: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.room.findFirstOrThrow({
        where: { id: input.id },
      });
    }),
});
