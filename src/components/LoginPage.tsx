import React, { useState } from 'react';
import { Shield, AlertCircle, Loader2, User, Building2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useLanguage } from '../lib/LanguageContext';

export function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { signIn, signUp } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const result = await signUp(email, password, fullName, organization);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccessMessage('Account created successfully! Please check your email to confirm your account, then login.');
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      }
    } else {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/30 mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('appTitle')}</h1>
          <p className="text-slate-400 text-sm">{t('appSubtitle')}</p>
        </div>

        {/* Login/Signup Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex mb-6 bg-slate-900/50 rounded-lg p-1">
            <button
              onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === 'login'
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('login')}
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === 'login' ? (
            <>
              <h2 className="text-xl font-semibold text-white mb-2">{t('welcomeBack')}</h2>
              <p className="text-slate-400 text-sm mb-6">{t('loginTitle')}</p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-white mb-2">Create Account</h2>
              <p className="text-slate-400 text-sm mb-6">Join the disaster relief coordination team</p>
            </>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3 mb-4">
              <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <p className="text-emerald-400 text-sm">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-slate-300 mb-2">
                    Organization (Optional)
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      id="organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                      placeholder="e.g., Red Cross, Army, NGO"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                {t('password')}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {mode === 'login' ? t('signingIn') : 'Creating account...'}
                </>
              ) : (
                mode === 'login' ? t('signIn') : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle between modes */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={toggleMode}
                className="ml-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                {mode === 'login' ? 'Sign Up' : t('login')}
              </button>
            </p>
          </div>

          {/* Demo Credentials Notice */}
          <div className="mt-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
            <p className="text-xs text-slate-400 text-center">
              {mode === 'login'
                ? 'Demo Mode: Use any email/password to login'
                : 'Create your account to join the relief coordination team'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Government of Sri Lanka - Disaster Management Centre
        </p>
      </div>
    </div>
  );
}