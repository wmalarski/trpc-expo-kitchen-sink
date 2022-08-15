import { zodResolver } from '@hookform/resolvers/zod';
import type { DefaultErrorShape } from '@trpc/server';
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
  error?: DefaultErrorShape | null;
};

export const RoomForm = ({
  defaultValues,
  isLoading,
  onSubmit,
  submitText,
  error,
}: Props): ReactElement => {
  const { register, handleSubmit } = useForm<RoomFormData>({
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
          Title
        </label>
        <input
          className="input w-full"
          id="title"
          type="text"
          disabled={isLoading}
          {...register('title', { required: true })}
        />
      </div>

      <div className="form-control w-full pb-2">
        <label className="label label-text" htmlFor="description">
          Description
        </label>
        <textarea
          className="input w-full"
          id="description"
          disabled={isLoading}
          {...register('description', { required: true })}
        />
      </div>

      <button className="btn btn-primary" type="submit" disabled={isLoading}>
        {submitText}
      </button>

      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </form>
  );
};
