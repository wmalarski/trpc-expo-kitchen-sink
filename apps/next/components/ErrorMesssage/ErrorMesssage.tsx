import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';

type Props = {
  message: string;
  onReloadClick: () => void;
};

export const ErrorMessage = ({
  message,
  onReloadClick,
}: Props): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'ErrorMessage' });
  return (
    <div className="flex flex-col">
      <span>{message}</span>
      <button onClick={onReloadClick}>{t('reload')}</button>
    </div>
  );
};
