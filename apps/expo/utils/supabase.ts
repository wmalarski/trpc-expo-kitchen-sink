import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, Session } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';

const supabaseUrl = Constants.manifest.extra.supabaseUrl;
const supabaseAnonKey = Constants.manifest.extra.supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  localStorage: AsyncStorage as any,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
});

export const useSession = (): Session | null => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return session;
};
