import 'react-native-gesture-handler';
//
import { SessionServiceProvider } from '@tens/common/src/services/SessionService';
import { NativeBaseProvider } from 'native-base';
import { ReactElement, useMemo, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Router } from './routes/Router';
import i18next from './utils/i18next';
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
            <I18nextProvider i18n={i18next}>
              <SafeAreaProvider>
                <Router />
              </SafeAreaProvider>
            </I18nextProvider>
          </NativeBaseProvider>
        </SessionServiceProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
