import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-indigo-200 to-pink-200 px-4 sm:px-6">
      <div
        onClick={() => navigate('/login')}
        className="flex flex-col items-center justify-center text-center cursor-pointer group p-4 sm:p-6 max-w-lg mx-auto focus:outline-none focus:ring-4 focus:ring-purple-400 rounded"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') navigate('/login');
        }}
      >
        <video
          src="/logo.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-52 h-52 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full border-8 border-white shadow-2xl transition-transform duration-300 group-hover:scale-105"
        />
        <h1 className="text-3xl sm:text-5xl font-extrabold mt-6 text-purple-800 group-hover:underline">
          Welcome to ProPath
        </h1>
        <p className="text-base sm:text-lg mt-2 text-gray-700 text-center max-w-md">
          Click the logo to log in and start your journey!
        </p>
      </div>
    </div>
  );
};

export default Welcome;
