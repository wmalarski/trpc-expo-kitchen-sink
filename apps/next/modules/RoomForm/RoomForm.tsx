import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1).max(32),
  description: z.string().min(0),
});

export type RoomFormData = z.infer<typeof schema>;

type Props = {
  defaultValues?: RoomFormData;
  isLoading: boolean;
  onSubmit: (data: RoomFormData) => void;
  submitText: string;
};

export const RoomForm = ({
  defaultValues,
  isLoading,
  onSubmit,
  submitText,
}: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'RoomForm' });

  const { register, handleSubmit, formState } = useForm<RoomFormData>({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues || {
      title: '',
      description: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="form-control w-full">
        <label className="label label-text" htmlFor="title">
          {t('nameLabel')}
        </label>
        <input
          className={clsx('input w-full', {
            'input-error': !!formState.errors.title,
          })}
          id="title"
          type="text"
          disabled={isLoading}
          placeholder={t('namePlaceholder')}
          {...register('title', { required: true })}
        />
        {formState.errors.title && (
          <label className="label">
            <span className="label-text-alt text-error">
              {formState.errors.title.message}
            </span>
          </label>
        )}
      </div>

      <div className="form-control w-full pb-2">
        <label className="label label-text" htmlFor="description">
          {t('descriptionLabel')}
        </label>
        <textarea
          className={clsx('input w-full', {
            'input-error': !!formState.errors.description,
          })}
          id="description"
          disabled={isLoading}
          placeholder={t('descriptionPlaceholder')}
          {...register('description', { required: true })}
        />
        {formState.errors.description && (
          <label className="label">
            <span className="label-text-alt text-error">
              {formState.errors.description.message}
            </span>
          </label>
        )}
      </div>

      <button
        className={clsx('btn btn-primary', { loading: isLoading })}
        type="submit"
        disabled={isLoading}
      >
        {submitText}
      </button>
    </form>
  );
};
