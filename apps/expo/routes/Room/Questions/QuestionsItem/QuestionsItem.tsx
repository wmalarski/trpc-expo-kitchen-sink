import type { InferQueryOutput } from '@tens/api/src/types';
import { trpc } from '@tens/expo/utils/trpc';
import {
  Actionsheet,
  Box,
  Divider,
  HStack,
  Text,
  useDisclose,
  VStack,
} from 'native-base';
import { ReactElement } from 'react';
import { TouchableOpacity } from 'react-native';
import { ReactionButton } from './ReactionButton/ReactionButton';

type Props = {
  question: InferQueryOutput<'question.list'>[0];
};

const reactions = ['👍', '👎', '❤️', '🙌', '👀', '😄', '😠'];

export const QuestionsItem = ({ question }: Props): ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclose();

  const queryClient = trpc.useContext();

  const onSuccess = () => {
    queryClient.invalidateQueries(['question.list']);
  };

  const addMutation = trpc.useMutation(['vote.add'], { onSuccess });
  const deleteMutation = trpc.useMutation(['vote.delete'], { onSuccess });
  const updateMutation = trpc.useMutation(['vote.update'], { onSuccess });

  const handleReactionClick = (content: string) => {
    if (!question.vote) {
      addMutation.mutate({ content, questionId: question.id });
    } else if (question.vote.content === content) {
      deleteMutation.mutate({ id: question.vote.id });
    } else {
      updateMutation.mutate({ content, id: question.vote.id });
    }
  };

  const votesCount = question.counts.reduce(
    (prev, curr) => prev + curr._count,
    0,
  );

  return (
    <Box bg="white" m={1}>
      <TouchableOpacity onPress={onOpen}>
        <VStack padding={4}>
          <Text>{votesCount}</Text>
          <Text>{question.content}</Text>
          {votesCount ? (
            <HStack w="100%" justifyContent="flex-start" space={1} pt={2}>
              {question.counts.map((count) => (
                <ReactionButton
                  key={count.content}
                  reaction={count.content}
                  onPress={() => handleReactionClick(count.content)}
                  question={question}
                />
              ))}
            </HStack>
          ) : null}
        </VStack>
      </TouchableOpacity>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content borderTopRadius="0">
          <HStack w="100%" justifyContent="center" space={1} pb={4}>
            {reactions.map((reaction) => (
              <ReactionButton
                key={reaction}
                reaction={reaction}
                onPress={() => handleReactionClick(reaction)}
                question={question}
              />
            ))}
          </HStack>
          <Divider />
          <Actionsheet.Item>Delete</Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </Box>
  );
};
