import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@tens/expo/utils/trpc';
import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  content: z.string().min(1),
});

type AddQuestionFormData = z.infer<typeof schema>;

type Props = {
  roomId: string;
};

export const AddQuestion = ({ roomId }: Props): ReactElement => {
  const queryClient = trpc.useContext();

  const mutation = trpc.useMutation(['question.add'], {
    onSuccess: () => {
      queryClient.invalidateQueries(['question.list']);
    },
  });

  const { register, handleSubmit } = useForm<AddQuestionFormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { content: '' },
  });

  const onSubmit = (input: AddQuestionFormData) => {
    mutation.mutate({ ...input, roomId });
  };

  return (
    <div onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <div className="form-control w-full">
        <label className="label label-text" htmlFor="question">
          Question
        </label>
        <input
          className="input w-full"
          id="question"
          type="text"
          disabled={mutation.isLoading}
          {...register('content', { required: true })}
        />
      </div>

      <button
        className="btn btn-primary"
        type="submit"
        disabled={mutation.isLoading}
      >
        Add
      </button>
    </div>
  );
};
