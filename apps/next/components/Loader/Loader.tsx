import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export const Loader = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Loader' });

  return <span>{t('loading')}</span>;
};
