import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@react-navigation/native';
import { useAnonService } from '@tens/common/src/services/SessionService';
import {
  Button,
  FormControl,
  Heading,
  HStack,
  Input,
  Text,
  useToast,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { z } from 'zod';
import type { StackParams } from '../Router';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type SignUpFormData = z.infer<typeof schema>;

export const SignUp = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'SignUp' });

  const toast = useToast();

  const anonService = useAnonService();

  const mutation = useMutation(anonService.signUp, {
    onError: () => {
      toast.show({
        title: t('error'),
        description: t('errorText'),
      });
    },
  });

  const { control, handleSubmit } = useForm<SignUpFormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (input: SignUpFormData) => {
    mutation.mutate(input);
  };

  return (
    <VStack p={4} pt={12} space={2}>
      <Heading>{t('signUp')}</Heading>

      <Controller
        control={control}
        name="email"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value }, formState }) => (
          <FormControl isRequired={true} isInvalid={!!formState.errors.email}>
            <VStack space={2}>
              <FormControl.Label>{t('email')}</FormControl.Label>
              <Input
                placeholder={t('emailPlaceholder')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {formState.errors.email?.message}
              </FormControl.ErrorMessage>
            </VStack>
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value }, formState }) => (
          <FormControl
            isRequired={true}
            isInvalid={!!formState.errors.password}
          >
            <VStack space={2}>
              <FormControl.Label>{t('password')}</FormControl.Label>
              <Input
                placeholder={t('passwordPlaceholder')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={true}
                autoCapitalize="none"
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {formState.errors.password?.message}
              </FormControl.ErrorMessage>
            </VStack>
          </FormControl>
        )}
      />

      <VStack pt={2} space={2}>
        <Button disabled={mutation.isLoading} onPress={handleSubmit(onSubmit)}>
          {t('signUp')}
        </Button>

        <HStack pt={2} alignItems="center" space={1} justifyContent="center">
          <Link<StackParams> to={{ screen: 'SendLink' }}>{t('sendLink')}</Link>
          <Text>{t('or')}</Text>
          <Link<StackParams> to={{ screen: 'SignIn' }}>{t('signIn')}</Link>
        </HStack>
      </VStack>
    </VStack>
  );
};
