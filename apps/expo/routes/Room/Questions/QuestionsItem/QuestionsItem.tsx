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
    <TouchableOpacity onPress={handleItemPress}>
      <Box padding={5} flex={1}>
        <Text>{question.content}</Text>
      </Box>
    </TouchableOpacity>
  );
};
