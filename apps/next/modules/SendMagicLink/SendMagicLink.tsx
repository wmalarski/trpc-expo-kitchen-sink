import { zodResolver } from '@hookform/resolvers/zod';
import { useAnonService } from '@tens/common/src/services/SessionService';
import { Toast, ToastElement } from '@tens/next/components/Toast/Toast';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { ReactElement, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

type SendMagicLinkFormData = z.infer<typeof schema>;

export const SendMagicLink = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'SendLink' });

  const toastRef = useRef<ToastElement>(null);

  const anonService = useAnonService();

  const mutation = useMutation(anonService.signIn, {
    onError: () => {
      toastRef.current?.publish();
    },
  });

  const { register, handleSubmit, formState } = useForm<SendMagicLinkFormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { email: '' },
  });

  const onSubmit = (input: SendMagicLinkFormData) => {
    mutation.mutate(input);
  };

  return (
    <div>
      <h1>{t('sendLink')}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="form-control w-full">
          <label className="label label-text" htmlFor="email">
            {t('email')}
          </label>
          <input
            className={clsx('input w-full', {
              'input-error': !!formState.errors.email,
            })}
            id="email"
            type="email"
            disabled={mutation.isLoading}
            placeholder={t('emailPlaceholder')}
            {...register('email', { required: true })}
          />
          {formState.errors.email && (
            <label className="label">
              <span className="label-text-alt text-error">
                {formState.errors.email.message}
              </span>
            </label>
          )}
        </div>
        <button
          className={clsx('btn btn-primary', { loading: mutation.isLoading })}
          type="submit"
          disabled={mutation.isLoading}
        >
          <span>{t('sendLink')}</span>
        </button>
      </form>
      <Toast ref={toastRef} variant="error" title={t('error')}>
        {t('errorText')}
      </Toast>
    </div>
  );
};
