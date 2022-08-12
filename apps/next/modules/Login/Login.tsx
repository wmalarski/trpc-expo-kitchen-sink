import { useAnonService } from '@tens/common/src/services/SessionService';
import { ReactElement, useState } from 'react';
import { useMutation } from 'react-query';

export const Login = (): ReactElement => {
  const anonService = useAnonService();

  const signInMutation = useMutation(anonService.signIn);

  const [email, setEmail] = useState('');

  const handleSendClick = () => {
    signInMutation.mutate({ email });
  };

  return (
    <div>
      <div>
        <h1>Supabase + Next.js</h1>
        <p>Sign in via magic link with your email below</p>
        <div>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <button onClick={handleSendClick} disabled={signInMutation.isLoading}>
            <span>
              {signInMutation.isLoading ? 'Loading' : 'Send magic link'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
