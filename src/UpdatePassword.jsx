import { useEffect, useState } from 'react';
import { supabase } from './utils/supabase';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token });
    } else {
      setMessage('Invalid or missing token in URL.');
    }
  }, []);

  const handleUpdatePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage('Failed to update password: ' + error.message);
    } else {
      setMessage('Password updated successfully!');
      setTimeout(() => navigate('/'), 2000); // redirect after success
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Reset Your Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <button
        onClick={handleUpdatePassword}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update Password
      </button>
      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
    </div>
  );
};

export default UpdatePassword;
