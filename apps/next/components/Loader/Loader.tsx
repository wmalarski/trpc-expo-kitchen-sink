import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';

export const Loader = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'Loader' });

  return <span>{t('loading')}</span>;
};
