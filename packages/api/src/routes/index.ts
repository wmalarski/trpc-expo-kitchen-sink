import { t } from '../trpc';
import { roomRouter } from './room';

export const appRouter = t.router({
  room: roomRouter,
});

export type AppRouter = typeof appRouter;
