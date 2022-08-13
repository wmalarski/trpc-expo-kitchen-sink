import { Question } from '@prisma/client';
import { Box, Text } from 'native-base';
import { ReactElement } from 'react';
import { TouchableOpacity } from 'react-native';

type Props = {
  question: Question;
};

export const QuestionsItem = ({ question }: Props): ReactElement => {
  const handleItemPress = () => {
    console.log(question);
  };

  return (
    <Box bg="white" m={1}>
      <TouchableOpacity onPress={handleItemPress}>
        <Box padding={4}>
          <Text>{question.content}</Text>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};
