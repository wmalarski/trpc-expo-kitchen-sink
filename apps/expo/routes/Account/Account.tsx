import { ApiError, Session } from '@supabase/supabase-js';
import { supabase } from '@tens/expo/utils/supabase';
import { Button, FormControl, Input } from 'native-base';
import { ReactElement, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

export const Account = ({ session }: { session: Session }): ReactElement => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatar_url, setAvatarUrl] = useState('');

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      if (!user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      Alert.alert((error as ApiError).message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async ({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) => {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      if (!user) throw new Error('No user on the session!');

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates, { returning: 'minimal' });

      if (error) {
        throw error;
      }
    } catch (error) {
      Alert.alert((error as ApiError).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <FormControl>
          <FormControl.Label>Email</FormControl.Label>
          <Input value={session?.user?.email} isDisabled />
        </FormControl>
      </View>

      <View style={styles.verticallySpaced}>
        <FormControl>
          <FormControl.Label>Username</FormControl.Label>
          <Input
            value={username || ''}
            onChangeText={(text) => setUsername(text)}
          />
        </FormControl>
      </View>

      <View style={styles.verticallySpaced}>
        <FormControl>
          <FormControl.Label>Website</FormControl.Label>
          <Input
            value={website || ''}
            onChangeText={(text) => setWebsite(text)}
          />
        </FormControl>
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          onPress={() => updateProfile({ username, website, avatar_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'UpdateAA'}
        </Button>
      </View>

      <View style={styles.verticallySpaced}>
        <Button onPress={() => supabase.auth.signOut()}>Sign Out</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
});
