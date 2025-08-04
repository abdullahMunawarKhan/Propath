import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-indigo-200 to-pink-200 px-6">
      <div
        onClick={() => navigate('/login')}
        className="flex flex-col items-center justify-center text-center cursor-pointer group"
      >
        <video
          src="/logo.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-72 h-72 sm:w-80 sm:h-80 rounded-full border-8 border-white shadow-2xl transition-transform duration-300 group-hover:scale-105"
        />
        <h1 className="text-5xl font-extrabold mt-6 text-purple-800 group-hover:underline">
          Welcome to ProPath
        </h1>
        <p className="text-lg mt-2 text-gray-700">
          Click the logo to log in and start your journey!
        </p>
      </div>
    </div>
  );
};

export default Welcome;
