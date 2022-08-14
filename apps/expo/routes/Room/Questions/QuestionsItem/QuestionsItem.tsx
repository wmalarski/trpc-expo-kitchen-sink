import type { InferQueryOutput } from '@tens/api/src/types';
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
import { useVoteToggleMutation } from './QuestionsItem.utils';
import { ReactionButton } from './ReactionButton/ReactionButton';

type Props = {
  question: InferQueryOutput<'question.list'>[0];
  cursor?: string;
  take: number;
};

const reactions = ['👍', '👎', '❤️', '🙌', '👀', '😄', '😠'];

export const QuestionsItem = ({
  question,
  cursor,
  take,
}: Props): ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclose();

  const mutation = useVoteToggleMutation({ question, cursor, take });

  const handleReactionClick = (content: string) => {
    mutation.mutate({ content, questionId: question.id });
  };

  const votesCount = question.counts.reduce(
    (prev, curr) => prev + curr._count,
    0,
  );

  return (
    <Box bg="white" m={1}>
      <TouchableOpacity onPress={onOpen}>
        <VStack padding={4}>
          <HStack space={2}>
            <Text fontWeight="medium">{votesCount}</Text>
            <Text>{question.content}</Text>
          </HStack>
          {votesCount ? (
            <HStack w="100%" justifyContent="flex-start" space={1} pt={2}>
              {question.counts.map(
                (count) =>
                  count._count > 0 && (
                    <ReactionButton
                      key={count.content}
                      reaction={count.content}
                      onPress={() => handleReactionClick(count.content)}
                      question={question}
                    />
                  ),
              )}
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
