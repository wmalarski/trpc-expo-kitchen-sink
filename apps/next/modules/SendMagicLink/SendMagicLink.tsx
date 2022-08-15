import { useAnonService } from '@tens/common/src/services/SessionService';
import clsx from 'clsx';
import { ReactElement, useState } from 'react';
import { useMutation } from 'react-query';

export const SendMagicLink = (): ReactElement => {
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
          placeholder="Your email"
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
          <span>{mutation.isLoading ? 'Loading' : 'Send magic link'}</span>
        </button>
      </div>
    </div>
  );
};
