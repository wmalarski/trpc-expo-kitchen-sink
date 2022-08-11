import { NativeBaseProvider } from 'native-base';
import { useMemo, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Router } from './routes/Router';
import { useSession } from './utils/supabase';
import { createTrpcClient, trpc } from './utils/trpc';

export default function App() {
  const session = useSession();
  const [queryClient] = useState(() => new QueryClient());
  const trpcClient = useMemo(() => createTrpcClient(), []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider>
          <SafeAreaProvider>
            <Router session={session} />
          </SafeAreaProvider>
        </NativeBaseProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
