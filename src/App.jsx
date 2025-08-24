import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './utils/supabase';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentInfoForm from './pages/StudentInfoForm';
import Dashboard from './pages/dashboard';
import Quiz from './pages/Quiz';
import Explore from './pages/Explore';
import Roadmaps from './pages/Roadmaps';
import Result from './pages/Result';
import Exams from './pages/Exams';
import UpdatePassword from './pages/UpdatePassword';
import Welcome from './pages/Welcome';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading ProPath...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <video
                src="/logo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="h-10 w-10 rounded-full shadow-md"
                aria-label="ProPath Logo"
              />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                ProPath
              </h1>
              <span className="hidden sm:inline text-sm text-gray-500 font-medium">
                Your Career Guide
              </span>
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Welcome, {user.email}
                </span>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setUser(null);
                  }}
                  className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/student-info" 
              element={user ? <StudentInfoForm user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/quiz" 
              element={user ? <Quiz user={user} /> : <Navigate to="/login" />} 
            />
            <Route path="/explore" element={<Explore />} />
            <Route path="/result" element={<Result />} />
            <Route path="/roadmaps" element={<Roadmaps />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/update-password" element={<UpdatePassword />} />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-gradient-to-t from-black/80 via-slate-900/80 to-slate-800/70 text-gray-300 border-t border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="text-center md:text-left">
              
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">About the Developer</p>
              <p className="text-xs text-gray-400 mt-1">Crafted with care. Connect with me: Abdullah Munawar Khan</p>
              <p className="text-sm text-gray-400">&copy; 2025 ProPath. Empowering students to discover their career path.</p>
            </div>
            <div className="flex justify-center md:justify-end items-center gap-3">
              <a
                href="https://www.linkedin.com/in/abdullah-munawar-khan-175a6b322"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                aria-label="LinkedIn profile"
                title="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 11.268h-3v-5.604c0-1.336-.027-3.055-1.861-3.055-1.862 0-2.146 1.454-2.146 2.957v5.702h-3v-10h2.879v1.367h.041c.401-.76 1.381-1.561 2.844-1.561 3.044 0 3.607 2.005 3.607 4.613v5.581z"/></svg>
                LinkedIn
              </a>
              <a
                href="https://github.com/abdullahmunawarkhan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-black text-white text-sm rounded-lg transition-colors"
                aria-label="GitHub profile"
                title="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 .5C5.73.5.98 5.25.98 11.53c0 4.86 3.15 8.98 7.51 10.43.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.05-3.06.67-3.71-1.3-3.71-1.3-.5-1.27-1.22-1.6-1.22-1.6-.99-.68.08-.66.08-.66 1.1.08 1.68 1.13 1.68 1.13.97 1.66 2.55 1.18 3.17.9.1-.7.38-1.18.69-1.45-2.44-.28-5.01-1.22-5.01-5.43 0-1.2.43-2.17 1.13-2.94-.11-.28-.49-1.43.11-2.98 0 0 .93-.3 3.05 1.12a10.6 10.6 0 0 1 2.78-.37c.94 0 1.88.12 2.77.36 2.12-1.42 3.05-1.12 3.05-1.12.6 1.55.22 2.7.11 2.98.7.77 1.12 1.74 1.12 2.94 0 4.22-2.58 5.14-5.03 5.41.39.34.73 1.01.73 2.04 0 1.47-.01 2.65-.01 3.01 0 .29.2.64.76.53 4.35-1.45 7.5-5.57 7.5-10.43C23.02 5.25 18.27.5 12 .5Z"/></svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
