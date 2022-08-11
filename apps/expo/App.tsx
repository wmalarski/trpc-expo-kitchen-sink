import { NativeBaseProvider } from 'native-base';
import { ReactElement, useMemo, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Router } from './routes/Router';
import { SessionServiceProvider } from './services/SessionService';
import { createTrpcClient, trpc } from './utils/trpc';

const App = (): ReactElement => {
  const [queryClient] = useState(() => new QueryClient());
  const trpcClient = useMemo(() => createTrpcClient(), []);

  return (
    <SessionServiceProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <NativeBaseProvider>
            <SafeAreaProvider>
              <Router />
            </SafeAreaProvider>
          </NativeBaseProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </SessionServiceProvider>
  );
};

export default App;
