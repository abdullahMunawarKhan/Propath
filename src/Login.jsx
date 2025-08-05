import React, { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetStatus, setResetStatus] = useState('');
  const [isSending, setIsSending] = useState(false);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorEmail('');
    setErrorPassword('');
    setLoginError('');

    if (!email) {
      setErrorEmail('Email is required.');
    } else if (!isValidEmail(email)) {
      setErrorEmail('Please enter a valid email address.');
    }

    if (!password) {
      setErrorPassword('Password is required.');
    }

    if (!email || !isValidEmail(email) || !password) return;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error?.message === 'Invalid login credentials') {
      setLoginError('Account not found, please sign up first.');
    } else if (data?.user) {
      navigate('/student-info');
    } else if (error) {
      setLoginError(error.message || 'Login failed.');
    }
  };

  const handleResetPassword = async () => {
    setResetStatus('');
    setIsSending(true);

    if (!email) {
      setResetStatus('⚠ Please enter your email first.');
      setIsSending(false);
      return;
    }

    if (!isValidEmail(email)) {
      setResetStatus('⚠ Please enter a valid email address.');
      setIsSending(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      if (
        error.message.toLowerCase().includes('user') ||
        error.message.toLowerCase().includes('invalid')
      ) {
        setResetStatus('❌ Account not found with this email.');
      } else {
        setResetStatus('❌ Failed to send reset email. Try again.');
      }
    } else {
      setResetStatus('✅ Check your email to reset your password.');
    }

    setIsSending(false);
  };

  // 🕒 Auto-dismiss reset alert
  useEffect(() => {
    if (resetStatus) {
      const timer = setTimeout(() => setResetStatus(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [resetStatus]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-[#8ec5fc] via-[#e0c3fc] to-[#f9f3f3] p-6 sm:p-8 mx-2 sm:mx-auto max-w-md sm:max-w-lg md:max-w-xl">
      {/* Background animation */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-xl shadow-2xl transform rotate-12 blur-sm animate-bounce-slow z-0"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-pink-400 rounded-full shadow-xl blur-md transform scale-110 animate-float z-0"></div>
      <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-yellow-300 rounded-full shadow-lg blur-sm animate-pulse z-0"></div>
      <div className="absolute bottom-1/4 left-10 w-14 h-14 bg-purple-400 rounded-3xl rotate-45 shadow-md animate-spin-slow z-0"></div>

      {/* Header */}
      <div className="z-10 bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl px-10 py-6 flex items-center space-x-8 mb-10">
        <video
          src="/logo.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="h-24 w-24 rounded-full shadow-lg"
        />
        <h1 className="text-5xl font-extrabold text-purple-800 tracking-wider">ProPath</h1>
      </div>

      {/* Login Form */}
      <div className="z-10 w-full max-w-full bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-10 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">Log In</h2>

        {/* Email */}
        <div className="w-full">
          <input
            type="email"
            placeholder="Email Address"
            aria-label="Email Address"
            className="w-full max-w-full px-4 py-3 rounded-full bg-white/70 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errorEmail && <p className="text-red-500 text-sm mt-1">{errorEmail}</p>}
        </div>

        {/* Password */}
        <div className="w-full relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            aria-label="Password"
            className="w-full max-w-full px-4 py-3 rounded-full bg-white/70 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-600"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
          {errorPassword && <p className="text-red-500 text-sm mt-1">{errorPassword}</p>}
        </div>

        {/* Error Message */}
        {loginError && <p className="text-red-600 text-sm text-center">{loginError}</p>}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-full font-semibold hover:scale-[1.02] transition shadow-lg"
        >
          Log In
        </button>

        {/* Forgot Password */}
        <div className="text-center mt-2">
          <button
            onClick={() => setShowForgotModal(true)}
            className="text-sm text-purple-700 underline hover:text-purple-900"
          >
            Forgot Password?
          </button>
        </div>

        {/* Sign Up */}
        <p className="text-sm text-center text-gray-700">
          New user?{' '}
          <span
            onClick={() => navigate('/Signup')}
            className="text-indigo-600 font-medium cursor-pointer underline"
          >
            Sign up here
          </span>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              aria-label="Close reset password modal"
              className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-2xl"
              onClick={() => {
                setShowForgotModal(false);
                setResetStatus('');
              }}
            >
              &times;
            </button>

            <h3 className="text-lg font-bold text-gray-800 mb-4">Reset Your Password</h3>
            <p className="text-sm text-gray-600 mb-3">
              Enter your registered email. A link to reset your password will be sent to your inbox.
            </p>

            <input
              type="email"
              placeholder="Email address"
              aria-label="Reset email address"
              className="w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleResetPassword}
              disabled={!email || isSending}
              className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
                !email || isSending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSending ? 'Sending...' : 'Send Reset Link'}
            </button>

            {resetStatus && (
              <div
                className={`mt-4 px-4 py-2 rounded-lg text-sm text-center animate-fade-in transition-all duration-300 ${
                  resetStatus.startsWith('✅')
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-red-100 text-red-700 border border-red-300'
                }`}
              >
                {resetStatus}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
