import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function VerifyEmail() {
  const navigate = useNavigate();
  const query = useQuery();
  const token = query.get('token') || '';
  const email = query.get('email') || '';
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    (async () => {
      const result = await authService.verifyEmail(token, email);
      if (result.success) {
        setStatus('success');
        setMessage('Email verified successfully! You may now sign in.');
        setTimeout(() => navigate('/auth'), 1800);
      } else {
        setStatus('error');
        setMessage(result.error || 'Unable to verify email.');
      }
    })();
  }, [email, navigate, token]);

  return (
    <div className="min-h-screen bg-[#f8faf8] dark:bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-lg rounded-3xl border border-gray-100 dark:border-gray-800 p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Email verification</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p>
        {status === 'error' && (
          <button type="button" onClick={() => navigate('/auth')} className="text-sm text-alx-lime hover:text-alx-lime-light">
            Go to sign in
          </button>
        )}
      </div>
    </div>
  );
}
