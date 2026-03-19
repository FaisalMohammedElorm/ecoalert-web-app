import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ecoAlertLogo from '../assets/EcoAlert.png';

export default function Auth() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) { setError('Please fill in all required fields.'); return; }
    if (!isLogin && form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (!isLogin && !form.name) { setError('Please enter your full name.'); return; }

    setIsLoading(true);
    const result = isLogin
      ? await login(form.email, form.password)
      : await signup(form.email, form.password, form.name, form.phone);
    setIsLoading(false);

    if (result.success) navigate('/home');
    else setError(result.error || 'Authentication failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] flex">
      {/* Left panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-eco-600 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-eco-700/50 rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-20 h-20 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20 p-2">
            <img src={ecoAlertLogo} alt="EcoAlert logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-4xl font-display font-black text-white mb-4 leading-tight">
            Together we keep<br />Ghana clean.
          </h2>
          <p className="text-eco-200/80 text-base leading-relaxed">
            Join thousands of Ghanaians reporting and resolving environmental issues every day.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[['2.4k+', 'Reports Filed'], ['89%', 'Resolved'], ['12+', 'Cities']].map(([v, l]) => (
              <div key={l} className="bg-white/10 border border-white/15 rounded-xl p-3">
                <p className="text-white font-display font-bold text-xl">{v}</p>
                <p className="text-eco-200 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <img src={ecoAlertLogo} alt="EcoAlert logo" className="h-11 w-auto object-contain" />
          </div>

          <h1 className="text-3xl font-display font-bold text-gray-900 mb-1">
            {isLogin ? 'Welcome back!' : 'Create account'}
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {isLogin ? 'Sign in to continue making a difference.' : 'Join the mission for a cleaner tomorrow.'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="label">Full Name</label>
                <input className="input-field" placeholder="Kwame Mensah" value={form.name} onChange={set('name')} autoComplete="name" />
              </div>
            )}

            <div>
              <label className="label">Email Address</label>
              <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" />
            </div>

            {!isLogin && (
              <div>
                <label className="label">Phone Number <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                <input className="input-field" type="tel" placeholder="+233 24 000 0000" value={form.phone} onChange={set('phone')} />
              </div>
            )}

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  className="input-field pr-10"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="label">Confirm Password</label>
                <input className="input-field" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={set('confirmPassword')} autoComplete="new-password" />
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-eco-600 hover:text-eco-700 font-medium">Forgot password?</button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setIsLogin(p => !p); setError(''); }} className="text-eco-600 font-semibold hover:text-eco-700">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
