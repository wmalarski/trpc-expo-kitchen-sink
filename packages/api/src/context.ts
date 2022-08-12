import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const token = req.headers.authorization;
  const jwt = token?.split(' ')[1];

  if (jwt) {
    const { user } = await supabase.auth.api.getUser(jwt);
    return { req, res, prisma, user, supabase };
  }

  return { req, res, prisma, user: null, supabase };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
