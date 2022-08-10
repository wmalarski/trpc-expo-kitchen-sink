import { NativeBaseProvider } from 'native-base';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Root } from './routes/Root/Root';
import { createTrpcClient, trpc } from './utils/trpc';

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => createTrpcClient());
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider>
          <SafeAreaProvider>
            <Root />
          </SafeAreaProvider>
        </NativeBaseProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
