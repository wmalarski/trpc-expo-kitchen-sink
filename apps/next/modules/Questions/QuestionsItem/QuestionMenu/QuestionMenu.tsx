import * as Popover from '@radix-ui/react-popover';
import type { InferQueryOutput } from '@tens/api/src/types';
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { FiX } from 'react-icons/fi';
import { AnswerAction } from './AnswerAction/AnswerAction';
import { DeleteQuestion } from './DeleteQuestion/DeleteQuestion';

type Props = {
  question: InferQueryOutput<'question.list'>['questions'][0];
  showAnswered?: boolean;
  take: number;
};

export const QuestionMenu = ({
  question,
  take,
  showAnswered,
}: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Room.Questions' });

  return (
    <Popover.Root>
      <Popover.Trigger className="btn m-1">{t('more')}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="dropdown-content bg-base-100 rounded-box w-52 p-2 shadow">
          <Popover.Arrow className="fill-base-100" />
          <Popover.Close className="btn btn-sm btn-circle absolute right-1 m-1">
            <FiX />
          </Popover.Close>
          <AnswerAction
            question={question}
            take={take}
            showAnswered={showAnswered}
          />
          <DeleteQuestion
            question={question}
            take={take}
            showAnswered={showAnswered}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
