import { useAnonService } from '@tens/common/src/services/SessionService';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { ReactElement, useState } from 'react';
import { useMutation } from 'react-query';

export const SendMagicLink = (): ReactElement => {
  const { t } = useTranslation('common', { keyPrefix: 'SendLink' });

  const anonService = useAnonService();

  const mutation = useMutation(anonService.signIn);

  const [email, setEmail] = useState('');

  const handleSendClick = () => {
    mutation.mutate({ email });
  };

  return (
    <div>
      <div>
        <input
          className="input"
          type="email"
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <button
          className={clsx('btn btn-primary', { loading: mutation.isLoading })}
          onClick={handleSendClick}
          disabled={mutation.isLoading}
        >
          <span>{t('sendLink')}</span>
        </button>
      </div>
    </div>
  );
};
