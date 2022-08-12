import { t } from '../trpc';
import { memberRouter } from './member';
import { questionRouter } from './question';
import { roomRouter } from './room';
import { voteRouter } from './vote';

export const appRouter = t.router({
  question: questionRouter,
  member: memberRouter,
  room: roomRouter,
  vote: voteRouter,
});

export type AppRouter = typeof appRouter;
