// src/UpdatePassword.jsx
import { useEffect, useState } from 'react';
import { supabase } from './utils/supabase';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);        // verifying token
  const [processing, setProcessing] = useState(false); // updating password
  const [sessionSet, setSessionSet] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const hash = window.location.hash || '';
        const params = new URLSearchParams(hash.replace('#', ''));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (!accessToken) {
          setMessage('Invalid or missing token in URL. Please request a new reset link.');
          setLoading(false);
          return;
        }

        // Try to set session. If refreshToken is empty, still try with empty string.
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (error) {
          // fallback: try exchangeCodeForSession (some Supabase flows put code in URL)
          // Note: exchangeCodeForSession expects the full URL (with query), but keep as fallback
          try {
            const fallback = await supabase.auth.exchangeCodeForSession();
            if (fallback.error) {
              setMessage('Session could not be restored. The link may be expired. Request a new reset link.');
              setSessionSet(false);
            } else {
              setSessionSet(true);
              setMessage('Session restored. You can update your password.');
            }
          } catch (ex) {
            setMessage('Session restore failed. Please request a new reset link.');
            setSessionSet(false);
          }
        } else {
          setSessionSet(true);
          setMessage('Session verified. You may now update your password.');
        }

        // Remove token from URL for security (so it doesn't stay in address bar)
        try {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch (e) {
          // ignore if not supported
        }
      } catch (err) {
        console.error('Token handling error:', err);
        setMessage('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleUpdate = async () => {
    setMessage('');
    if (!newPassword || !confirmPassword) {
      setMessage('Please fill in both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('❌ Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setMessage('Password should be at least 6 characters.');
      return;
    }
    if (!sessionSet) {
      setMessage('No valid session. Please use the reset link from your email.');
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        console.error('updateUser error:', error);
        setMessage('❌ Failed to update password: ' + (error.message || 'Unknown error'));
      } else {
        setMessage('✅ Password updated successfully. Redirecting to login...');
        setTimeout(() => navigate('/login'), 1800);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setMessage('❌ Unexpected error occurred. Try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4 py-8">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-700 text-center">🔐 Set New Password</h2>

        {loading ? (
          <p className="text-center text-gray-500">Verifying reset link...</p>
        ) : (
          <>
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute top-3 right-3 text-gray-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                autoComplete="new-password"
              />
            </div>

            <button
              onClick={handleUpdate}
              disabled={!sessionSet || processing}
              className={`w-full py-3 rounded-md font-medium text-white transition ${
                !sessionSet || processing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {processing ? 'Updating...' : 'Update Password'}
            </button>

            {message && (
              <p className="mt-4 text-center text-sm text-gray-700">
                {message}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UpdatePassword;
