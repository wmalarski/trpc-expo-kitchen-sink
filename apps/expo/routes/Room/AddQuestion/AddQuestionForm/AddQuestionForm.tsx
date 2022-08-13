import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@tens/expo/utils/trpc';
import {
  Button,
  Flex,
  FormControl,
  TextArea,
  useToast,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  content: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

type Props = {
  roomId: string;
  onClose: () => void;
};

export const AddQuestionForm = ({ roomId, onClose }: Props): ReactElement => {
  const toast = useToast();

  const queryClient = trpc.useContext();

  const addMutation = trpc.useMutation(['question.add'], {
    onSuccess: () => {
      queryClient.invalidateQueries(['question.list']);
      toast.show({ description: 'Success' });
      onClose();
    },
    onError: () => {
      toast.show({ description: 'Failure' });
    },
  });

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { content: '' },
  });

  const onSubmit = (input: FormData) => {
    addMutation.mutate({ ...input, roomId });
  };

  return (
    <VStack space={2}>
      <Controller
        control={control}
        name="content"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value }, formState }) => (
          <FormControl isRequired={true} isInvalid={!!formState.errors.content}>
            <VStack space={2}>
              <FormControl.Label>Question</FormControl.Label>
              <TextArea
                autoCompleteType="cc-csc"
                placeholder="Question"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {formState.errors.content?.message}
              </FormControl.ErrorMessage>
            </VStack>
          </FormControl>
        )}
      />
      <Flex align="flex-end" justify="flex-end" direction="row">
        <Button variant="ghost" colorScheme="blueGray" onPress={onClose}>
          Cancel
        </Button>
        <Button
          disabled={addMutation.isLoading}
          onPress={handleSubmit(onSubmit)}
        >
          Save
        </Button>
      </Flex>
    </VStack>
  );
};
