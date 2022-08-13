import { zodResolver } from '@hookform/resolvers/zod';
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
import { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export const SignIn = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'SignIn' });

  const anonService = useAnonService();

  const signInMutation = useMutation(anonService.signIn);

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (input: FormData) => {
    signInMutation.mutate(input);
  };

  return (
    <VStack p={4} space={2}>
      <Heading>{t('signIn')}</Heading>

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

      <Box pt={4}>
        <Button
          disabled={signInMutation.isLoading}
          onPress={handleSubmit(onSubmit)}
        >
          {t('signIn')}
        </Button>
      </Box>
    </VStack>
  );
};
