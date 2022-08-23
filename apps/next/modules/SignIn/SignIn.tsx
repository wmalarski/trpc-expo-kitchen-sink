import { zodResolver } from '@hookform/resolvers/zod';
import { useAnonService } from '@tens/common/src/services/SessionService';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type SignInFormData = z.infer<typeof schema>;

export const SignIn = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'SignIn' });

  const anonService = useAnonService();

  const mutation = useMutation(anonService.signIn);

  const { register, handleSubmit } = useForm<SignInFormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (input: SignInFormData) => {
    mutation.mutate(input);
  };

  return (
    <div>
      <div>
        <h1>{t('signIn')}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div className="form-control w-full">
            <label className="label label-text" htmlFor="email">
              {t('email')}
            </label>
            <input
              className="input w-full"
              id="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              disabled={mutation.isLoading}
              {...register('email', { required: true })}
            />
          </div>

          <div className="form-control w-full pb-2">
            <label className="label label-text" htmlFor="password">
              {t('password')}
            </label>
            <input
              className="input w-full"
              id="password"
              type="password"
              disabled={mutation.isLoading}
              placeholder={t('passwordPlaceholder')}
              {...register('password', { required: true })}
            />
          </div>

          <button
            className={clsx('btn btn-primary', { loading: mutation.isLoading })}
            type="submit"
            disabled={mutation.isLoading}
          >
            {t('signIn')}
          </button>

          {/* {mutation.error && (
            <p style={{ color: 'red' }}>{mutation.error.message}</p>
          )} */}
        </form>
      </div>
    </div>
  );
};
