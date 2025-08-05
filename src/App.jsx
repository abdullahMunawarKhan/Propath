import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './utils/supabase';
import Login from './Login';
import Signup from './Signup';
import StudentInfoForm from './StudentInfoForm';
import Dashboard from './dashboard';
import Quiz from './Quiz';
import Explore from './Explore';
import Roadmaps from './Roadmaps';
import Result from './Result';
import Exams from './Exams';
import UpdatePassword from './UpdatePassword';
import Welcome from './Welcome';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/background.png")' }}
    >
      <header className="w-full text-center py-4 bg-black bg-opacity-60 text-white text-2xl sm:text-3xl font-bold shadow-md sticky top-0 z-50">
        ProPath - Your Career guider
      </header>

      <main className="flex justify-center items-center p-4 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-xl sm:max-w-3xl md:max-w-4xl bg-white bg-opacity-90 rounded-lg shadow-lg p-4 sm:p-6 mx-2 sm:mx-auto">
          <Routes>
            <Route path="/" element={<Welcome />} /> {/* ✅ Welcome Route */}
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/student-info" element={user ? <StudentInfoForm user={user} /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/quiz" element={user ? <Quiz user={user} /> : <Navigate to="/login" />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/result" element={<Result />} />
            <Route path="/roadmaps" element={<Roadmaps />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/update-password" element={<UpdatePassword />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
