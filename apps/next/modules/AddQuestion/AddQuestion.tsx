import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@tens/next/utils/trpc';
import clsx from 'clsx';
import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const schema = z.object({
  content: z.string().min(1),
});

type AddQuestionFormData = z.infer<typeof schema>;

type Props = {
  roomId: string;
};

export const AddQuestion = ({ roomId }: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Room.AddQuestion' });

  const { register, handleSubmit, reset } = useForm<AddQuestionFormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { content: '' },
  });

  const mutation = trpc.useMutation(['question.add'], {
    onSuccess: () => {
      reset();
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
            className="input w-full"
            id="question"
            type="text"
            placeholder={t('questionPlaceholder')}
            disabled={mutation.isLoading}
            {...register('content', { required: true })}
          />
        </div>

        <button
          className={clsx('btn btn-primary', { loading: mutation.isLoading })}
          type="submit"
          disabled={mutation.isLoading}
        >
          {t('save')}
        </button>
      </form>
    </div>
  );
};
