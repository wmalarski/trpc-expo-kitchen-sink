import 'react-native-gesture-handler';
//
import { SessionServiceProvider } from '@tens/common/src/services/SessionService';
import { NativeBaseProvider } from 'native-base';
import { ReactElement, useMemo, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Router } from './routes/Router';
import { supabase } from './utils/supabase';
import { createTrpcClient, trpc } from './utils/trpc';

const App = (): ReactElement => {
  const [queryClient] = useState(() => new QueryClient());
  const trpcClient = useMemo(() => createTrpcClient(), []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SessionServiceProvider supabase={supabase}>
          <NativeBaseProvider>
            <SafeAreaProvider>
              <Router />
            </SafeAreaProvider>
          </NativeBaseProvider>
        </SessionServiceProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
