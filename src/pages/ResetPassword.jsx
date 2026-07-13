import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const query = useQuery();
  const token = query.get('token') || '';
  const initialEmail = query.get('email') || '';
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isResetFlow = Boolean(token && initialEmail);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    setIsSubmitting(true);
    const result = await authService.requestPasswordReset(email);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Unable to send reset email.');
      return;
    }

    setMessage('If that email is registered, you will receive a password reset link shortly.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    const result = await authService.resetPassword(initialEmail, token, password);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Unable to reset password.');
      return;
    }

    setMessage('Password updated successfully. Redirecting to sign in...');
    setTimeout(() => navigate('/auth'), 1200);
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] dark:bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-lg rounded-3xl border border-gray-100 dark:border-gray-800 p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {isResetFlow ? 'Set a new password' : 'Reset your password'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {isResetFlow
            ? `Reset the password for ${initialEmail}`
            : 'Enter your email and we will send a password reset link.'}
        </p>
        {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3 text-sm">{error}</div>}
        {message && <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 text-sm">{message}</div>}
        <form onSubmit={isResetFlow ? handleSubmit : handleRequestReset} className="space-y-4">
          <div>
            <label className="label">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full"
              placeholder="you@example.com"
              required
              disabled={isResetFlow}
            />
          </div>
          {isResetFlow ? (
            <>
              <div>
                <label className="label">New password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
              <div>
                <label className="label">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field w-full"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
            </>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-3 disabled:opacity-70"
          >
            {isSubmitting ? 'Processing…' : isResetFlow ? 'Update password' : 'Send reset link'}
          </button>
        </form>
        <button type="button" onClick={() => navigate('/auth')} className="mt-4 text-sm text-alx-lime hover:text-alx-lime-light">
          Back to sign in
        </button>
      </div>
    </div>
  );
}
