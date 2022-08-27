import { zodResolver } from '@hookform/resolvers/zod';
import { Toast, ToastElement } from '@tens/next/components/Toast/Toast';
import { trpc } from '@tens/next/utils/trpc';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { ReactElement, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  content: z.string().min(5),
});

type AddQuestionFormData = z.infer<typeof schema>;

type Props = {
  roomId: string;
};

export const AddQuestion = ({ roomId }: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Room.AddQuestion' });

  const toastRef = useRef<ToastElement>(null);

  const { register, handleSubmit, reset, formState } =
    useForm<AddQuestionFormData>({
      resolver: zodResolver(schema as any),
      defaultValues: { content: '' },
    });

  const mutation = trpc.proxy.question.add.useMutation({
    onSuccess: () => {
      reset();
    },
    onError: () => {
      toastRef.current?.publish();
    },
  });

  const onSubmit = (input: AddQuestionFormData) => {
    mutation.mutate({ ...input, roomId });
  };

  return (
    <div className="card">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-body bg-base-300 flex flex-col gap-4"
      >
        <h2 className="card-title">{t('header')}</h2>
        <div className="form-control w-full">
          <label className="label label-text" htmlFor="question">
            {t('questionLabel')}
          </label>
          <input
            className={clsx('input w-full', {
              'input-error': !!formState.errors.content,
            })}
            id="question"
            type="text"
            placeholder={t('questionPlaceholder')}
            disabled={mutation.isLoading}
            {...register('content', { required: true })}
          />
          {formState.errors.content && (
            <label className="label">
              <span className="label-text-alt text-error">
                {formState.errors.content.message}
              </span>
            </label>
          )}
        </div>

        <button
          className={clsx('btn btn-primary', { loading: mutation.isLoading })}
          type="submit"
          disabled={mutation.isLoading}
        >
          {t('save')}
        </button>
      </form>
      <Toast ref={toastRef} variant="error" title={t('errorTitle')}>
        {t('errorDesc')}
      </Toast>
    </div>
  );
};
