import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@react-navigation/native';
import {
  AddIcon,
  Button,
  FormControl,
  Heading,
  Input,
  TextArea,
  useToast,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { trpc } from '../../utils/trpc';

const schema = z.object({
  title: z.string().min(1).max(32),
  description: z.string().min(0),
});

type FormData = z.infer<typeof schema>;

export const Home = (): ReactElement => {
  const toast = useToast();

  const addRoomMutation = trpc.useMutation(['room.add'], {
    onSuccess: (data) => {
      console.log(data);
      toast.show({
        description: 'Success',
      });
    },
    onError: (error) => {
      console.log(error);
      toast.show({
        description: 'Failure',
      });
    },
  });

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = (input: FormData) => {
    addRoomMutation.mutate(input);
  };

  return (
    <VStack p={4} pt={16} space={2}>
      <Heading>Add room</Heading>

      <Controller
        control={control}
        name="title"
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value }, formState }) => (
          <FormControl isRequired={true} isInvalid={!!formState.errors.title}>
            <VStack pt={2} space={2}>
              <FormControl.Label>Name</FormControl.Label>
              <Input
                placeholder="Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {formState.errors.title?.message}
              </FormControl.ErrorMessage>
            </VStack>
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value }, formState }) => (
          <FormControl isInvalid={!!formState.errors.description}>
            <VStack pt={2} space={2}>
              <FormControl.Label>Description</FormControl.Label>
              <TextArea
                autoCompleteType="cc-csc"
                placeholder="Description"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {formState.errors.description?.message}
              </FormControl.ErrorMessage>
            </VStack>
          </FormControl>
        )}
      />

      <VStack pt={4}>
        <Button
          disabled={addRoomMutation.isLoading}
          onPress={handleSubmit(onSubmit)}
          leftIcon={<AddIcon />}
        >
          Add room
        </Button>
        <Link to="/Account">AA</Link>
      </VStack>
    </VStack>
  );
};
