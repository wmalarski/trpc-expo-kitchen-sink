import { PrismaClient } from '@prisma/client';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  return { req, res, prisma };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
