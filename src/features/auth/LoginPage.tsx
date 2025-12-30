import React, { useState } from 'react';
import { Lock, Wallet } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login, clearError } from './authSlice';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const [passcode, setPasscode] = useState('');
  const [role, setRole] = useState<UserRole>('husband');
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ passcode, role, rememberMe }));
  };

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FinTracker</h1>
          <p className="text-gray-600">Personal Financial Tracking System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Select your role and enter passcode</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Who are you?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('husband')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    role === 'husband'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">👨</div>
                    <div className={`font-semibold ${
                      role === 'husband' ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      Pins
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('wife')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    role === 'wife'
                      ? 'border-pink-500 bg-pink-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">🧕</div>
                    <div className={`font-semibold ${
                      role === 'wife' ? 'text-pink-700' : 'text-gray-700'
                    }`}>
                      Pinses
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Passcode Input */}
            <div>
              <Input
                type="password"
                label="Passcode"
                placeholder="Enter your passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                error={error || undefined}
                disabled={loading}
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                Remember me on this device
              </label>
            </div>

            {/* Submit Button */}
            <Button type="submit" fullWidth disabled={loading || !passcode}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <Lock className="w-4 h-4 mr-2" />
              <span>Your financial data is secure and private</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Designed with 💗 for by Q</p>
        </div>
      </div>
    </div>
  );
};