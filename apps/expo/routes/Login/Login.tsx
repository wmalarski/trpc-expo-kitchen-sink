import { useAnonService } from '@tens/common/src/services/SessionService';
import {
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import { ReactElement, useState } from 'react';
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
    <VStack p={4} space={2}>
      <Heading>Sign In</Heading>

      <FormControl isRequired>
        <VStack pt={2} space={2}>
          <FormControl.Label>Email</FormControl.Label>
          <Input
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={'none'}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Atleast 6 characters are required.
          </FormControl.ErrorMessage>
        </VStack>
      </FormControl>

      <FormControl isRequired>
        <VStack space={2}>
          <FormControl.Label>Password</FormControl.Label>
          <Input
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={'none'}
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Atleast 6 characters are required.
          </FormControl.ErrorMessage>
        </VStack>
      </FormControl>

      <Box pt={4}>
        <Button
          disabled={signInMutation.isLoading}
          onPress={() => handleSignInPress()}
        >
          Sign in
        </Button>
      </Box>

      <Box pt={4}>
        <Button
          disabled={signUpMutation.isLoading}
          onPress={() => handleSignUpPress()}
        >
          Sign up
        </Button>
      </Box>
    </VStack>
  );
};
