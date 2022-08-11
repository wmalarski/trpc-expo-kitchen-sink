import { ReactElement, ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createTrpcClient, trpc } from '../utils/trpc';
import { useSession } from './SessionService';

type Props = {
  children: ReactNode;
};

export const ApiService = ({ children }: Props): ReactElement => {
  const [queryClient] = useState(() => new QueryClient());

  const session = useSession();
  const trpcClient = useMemo(() => createTrpcClient(session), [session]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
