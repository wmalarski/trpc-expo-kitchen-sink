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
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

export const Login = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Login' });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const anonService = useAnonService();

  const signInMutation = useMutation(anonService.signIn);
  const signUpMutation = useMutation(anonService.signUp);

  const handleSignInPress = () => {
    signInMutation.mutate({ email, password });
  };

  const handleSignUpPress = () => {
    signUpMutation.mutate({ email, password });
  };

  return (
    <VStack p={4} space={2}>
      <Heading>{t('signIn')}</Heading>

      <FormControl isRequired>
        <VStack pt={2} space={2}>
          <FormControl.Label>{t('email')}</FormControl.Label>
          <Input
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder={t('emailPlaceholder')}
            autoCapitalize="none"
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Atleast 6 characters are required.
          </FormControl.ErrorMessage>
        </VStack>
      </FormControl>

      <FormControl isRequired>
        <VStack space={2}>
          <FormControl.Label>{t('password')}</FormControl.Label>
          <Input
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder={t('passwordPlaceholder')}
            autoCapitalize="none"
          />
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Atleast 6 characters are required.
          </FormControl.ErrorMessage>
        </VStack>
      </FormControl>

      <Box pt={4}>
        <Button disabled={signInMutation.isLoading} onPress={handleSignInPress}>
          {t('signIn')}
        </Button>
      </Box>

      <Box pt={4}>
        <Button disabled={signUpMutation.isLoading} onPress={handleSignUpPress}>
          {t('signUp')}
        </Button>
      </Box>
    </VStack>
  );
};
