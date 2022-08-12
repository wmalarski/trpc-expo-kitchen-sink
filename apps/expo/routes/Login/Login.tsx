import { useAnonService } from '@tens/common/src/services/SessionService';
import { Button, FormControl, Input } from 'native-base';
import { ReactElement, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useMutation } from 'react-query';

export const Login = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const anonService = useAnonService();

  const signInMutation = useMutation(anonService.signIn);
  const signUpMutation = useMutation(anonService.signUp);

  const handleSignInPress = async () => {
    signInMutation.mutate({ email, password });
  };

  const handleSignUpPress = async () => {
    signUpMutation.mutate({ email, password });
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
        <Button
          disabled={signInMutation.isLoading}
          onPress={() => handleSignInPress()}
        >
          Sign in
        </Button>
      </View>

      <View style={styles.verticallySpaced}>
        <Button
          disabled={signUpMutation.isLoading}
          onPress={() => handleSignUpPress()}
        >
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
