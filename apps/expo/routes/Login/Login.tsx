import { supabase } from '@tens/expo/utils/supabase';
import { Button, FormControl, Input } from 'native-base';
import { ReactElement, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

export const Login = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signInWithEmail = async () => {
    setLoading(true);
    const { user, error } = await supabase.auth.signIn({
      email: email,
      password: password,
    });

    console.log({ user });

    if (error) Alert.alert(error.message);
    setLoading(false);
  };

  const signUpWithEmail = async () => {
    setLoading(true);
    const { user, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    console.log({ user });

    if (error) Alert.alert(error.message);
    setLoading(false);
  };

  return (
    <View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <FormControl>
          <FormControl.Label>Email</FormControl.Label>
          <Input
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={'none'}
          />
        </FormControl>
      </View>

      <View style={styles.verticallySpaced}>
        <FormControl>
          <FormControl.Label>Password</FormControl.Label>
          <Input
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={'none'}
          />
        </FormControl>
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button disabled={loading} onPress={() => signInWithEmail()}>
          Sign in
        </Button>
      </View>

      <View style={styles.verticallySpaced}>
        <Button disabled={loading} onPress={() => signUpWithEmail()}>
          Sign up
        </Button>
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
