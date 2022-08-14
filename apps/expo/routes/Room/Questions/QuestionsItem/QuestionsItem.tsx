import type { InferQueryOutput } from '@tens/api/src/types';
import {
  Actionsheet,
  Box,
  Divider,
  HStack,
  Pressable,
  Text,
  useDisclose,
  VStack,
} from 'native-base';
import { ReactElement } from 'react';
import { AnsweredActions } from './AnsweredActions/AnsweredActions';
import { DeleteAction } from './DeleteAction/DeleteAction';
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
      <Pressable onPress={onOpen}>
        <HStack>
          <Box
            width={2}
            bg={question.answered ? 'success.400' : 'coolGray.400'}
            height="100%"
          />
          <VStack
            flexGrow={1}
            padding={4}
            bg={isOpen ? 'blueGray.100' : undefined}
          >
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
        </HStack>
      </Pressable>
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
          <AnsweredActions question={question} cursor={cursor} take={take} />
          <DeleteAction question={question} cursor={cursor} take={take} />
        </Actionsheet.Content>
      </Actionsheet>
    </Box>
  );
};
