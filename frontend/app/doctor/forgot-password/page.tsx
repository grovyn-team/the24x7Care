'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../lib/api';

export default function DoctorForgotPasswordPage() {
  const { applySession } = useAuth();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      setMessage(res.message);
      setStep(2);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const reset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const session = await authApi.resetPassword(email, otp.trim(), newPassword);
      applySession(session, '/doctor/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/the247_care_logo.svg"
              alt="The24x7Care"
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset password</h1>
          <p className="text-gray-600 text-sm">
            Doctor portal · we will email a one-time code to your registered address
          </p>
        </div>

        {error ? (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        ) : null}

        {message && step === 2 ? (
          <div className="mb-4 bg-teal-50 border border-teal-200 text-teal-900 px-4 py-3 rounded-lg text-sm">
            {message}
          </div>
        ) : null}

        {step === 1 ? (
          <form onSubmit={requestOtp} className="space-y-5">
            <div>
              <label htmlFor="fp-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="fp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent"
                placeholder="doctor@the247care.com"
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Send code'}
            </button>
          </form>
        ) : (
          <form onSubmit={reset} className="space-y-5">
            <div>
              <label htmlFor="fp-otp" className="block text-sm font-medium text-gray-700 mb-2">
                6-digit code
              </label>
              <input
                id="fp-otp"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700 tracking-widest"
                placeholder="000000"
                autoComplete="one-time-code"
              />
            </div>
            <div>
              <label htmlFor="fp-np" className="block text-sm font-medium text-gray-700 mb-2">
                New password
              </label>
              <input
                id="fp-np"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label htmlFor="fp-cf" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm new password
              </label>
              <input
                id="fp-cf"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-700"
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 disabled:opacity-50"
            >
              {loading ? 'Saving…' : 'Update password & sign in'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp('');
                setNewPassword('');
                setConfirm('');
                setMessage('');
                setError('');
              }}
              className="w-full text-sm text-teal-800 hover:underline"
            >
              ← Use a different email
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-gray-600">
          <Link href="/doctor/login" className="text-teal-700 font-medium hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
