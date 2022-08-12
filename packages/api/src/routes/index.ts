import { t } from '../trpc';
import { questionRouter } from './question';
import { roomRouter } from './room';
import { voteRouter } from './vote';

export const appRouter = t.router({
  question: questionRouter,
  room: roomRouter,
  vote: voteRouter,
});

export type AppRouter = typeof appRouter;
