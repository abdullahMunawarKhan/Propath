import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './utils/supabase';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const restoreSession = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession();
      if (error) {
        setStatus('Session not found or expired. Please use the reset link again.');
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const handleUpdate = async () => {
    if (!newPassword || !confirmPassword) {
      setStatus('Please fill in both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus('❌ Passwords do not match.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setStatus('❌ Failed to update password. Please try again.');
    } else {
      setStatus('✅ Password updated successfully. Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-100 p-6">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-blue-700 text-center">Set New Password</h2>

        {loading ? (
          <p className="text-center text-gray-500">Restoring session...</p>
        ) : (
          <>
            {/* New Password Field */}
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-2 right-3 text-gray-600"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded pr-10"
              />
            </div>

            <button
              onClick={handleUpdate}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={!newPassword || !confirmPassword}
            >
              Update Password
            </button>

            {status && <p className="mt-3 text-center text-sm text-gray-700">{status}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default UpdatePassword;