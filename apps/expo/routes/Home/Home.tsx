import {
  AddIcon,
  Box,
  Button,
  FormControl,
  Heading,
  Input,
  TextArea,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import { ReactElement, useState } from 'react';
import { trpc } from '../../utils/trpc';

export const Home = (): ReactElement => {
  const [title] = useState('');
  const [description] = useState('');

  const addRoomMutation = trpc.useMutation(['room.add']);

  const handleSignOutPress = () => {
    addRoomMutation.mutate({
      description,
      title,
    });
  };

  return (
    <VStack p={4} space={2}>
      <Heading>Create room</Heading>

      <FormControl isRequired>
        <VStack pt={2} space={2}>
          <FormControl.Label>Name</FormControl.Label>
          <Input placeholder="Name" />
          <FormControl.HelperText>
            Must be atleast 6 characters.
          </FormControl.HelperText>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Atleast 6 characters are required.
          </FormControl.ErrorMessage>
        </VStack>
      </FormControl>

      <FormControl isRequired>
        <VStack space={2}>
          <FormControl.Label>Description</FormControl.Label>
          <TextArea autoCompleteType="cc-csc" placeholder="Description" />
          <FormControl.HelperText>
            Must be atleast 6 characters.
          </FormControl.HelperText>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Atleast 6 characters are required.
          </FormControl.ErrorMessage>
        </VStack>
      </FormControl>

      <Box pt={4}>
        <Button
          disabled={addRoomMutation.isLoading}
          onPress={handleSignOutPress}
          leftIcon={<AddIcon />}
        >
          Create room
        </Button>
      </Box>
    </VStack>
  );
};
