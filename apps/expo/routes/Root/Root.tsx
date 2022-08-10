import { Session } from '@supabase/supabase-js';
import { supabase } from '@tens/expo/utils/supabase';
import { ReactElement, useEffect, useState } from 'react';
import { View } from 'react-native';
import Account from '../Account/Account';
import { Auth } from '../Login/Login';

export const Root = (): ReactElement => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View>
      {session && session.user ? (
        <Account key={session.user.id} session={session} />
      ) : (
        <Auth />
      )}
    </View>
  );
};
