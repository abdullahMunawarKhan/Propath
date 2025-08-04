import React, { useEffect, useState } from 'react';
import { supabase } from './utils/supabase';
import { useNavigate } from 'react-router-dom';

const domainSuggestions = [
  'Medical', 'Engineering', 'NDA', 'UPSC', 'Army',
  'CA', 'Bank Manager', 'Teacher', 'Aviation', 'Police',
  'Financial Analyst', 'Political Advisor', 'Fashion & Luxury Industry',
    'Sports & Fitness Career',
    'Creative Media & Entertainment',
    'Culinary Arts & Food Innovation',
    'Art, Design & Creativity'
];

const StudentInfoForm = ({ user }) => {
  const [name, setName] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [stream, setStream] = useState('');
  const [domain, setDomain] = useState([]);
  const [manualDomain, setManualDomain] = useState('');
  const [suggestions, setSuggestions] = useState(domainSuggestions);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfo = async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Fetch error:', error.message);
      }

      if (data) {
        setName(data.name);
        setClassLevel(data.class_level);
        setStream(data.stream || '');
        setDomain(data.domain || []);
        const selectedSet = new Set(data.domain || []);
        setSuggestions(domainSuggestions.filter(d => !selectedSet.has(d)));
      }
    };

    if (user?.id) fetchInfo();
  }, [user]);

  const handleDomainSelect = (d) => {
    if (!domain.includes(d)) {
      setDomain(prev => [...prev, d]);
      setSuggestions(prev => prev.filter(item => item !== d));
    }
  };

  const handleDomainRemove = (d) => {
    setDomain(prev => prev.filter(item => item !== d));
    if (!domainSuggestions.includes(d)) return;
    setSuggestions(prev => [...prev, d]);
  };

  const handleManualDomainAdd = () => {
    const trimmed = manualDomain.trim();
    if (trimmed && !domain.includes(trimmed)) {
      setDomain(prev => [...prev, trimmed]);
      setManualDomain('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !classLevel || (classLevel === '11th-12th' && !stream)) {
      alert('Please fill all required fields.');
      return;
    }

    const payload = {
      user_id: user.id,
      name,
      class_level: classLevel,
      stream: stream || null,
      domain,
    };

    console.log("Submitting data:", payload);

    const { error } = await supabase
      .from('students')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      console.error("Supabase error:", error.message);
      alert("Error saving info. Please check console.");
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-700">Student Information</h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1 text-gray-700">Name</label>
          <input
            type="text"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Class Level */}
        <div className="mb-4">
          <label className="block font-medium mb-1 text-gray-700">Class Level</label>
          <div className="flex gap-4">
            {['9th-10th', '11th-12th'].map(level => (
              <button
                key={level}
                type="button"
                className={`px-5 py-2 rounded-md border ${
                  classLevel === level ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                } hover:scale-105 transition`}
                onClick={() => {
                  setClassLevel(level);
                  setStream('');
                  setDomain([]);
                  setSuggestions(domainSuggestions);
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Stream */}
        {classLevel === '11th-12th' && (
          <div className="mb-4">
            <label className="block font-medium mb-1 text-gray-700">Stream</label>
            <div className="flex gap-4">
              {['Science', 'Commerce', 'Arts'].map(s => (
                <button
                  key={s}
                  type="button"
                  className={`px-5 py-2 rounded-md border ${
                    stream === s ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700'
                  } hover:scale-105 transition`}
                  onClick={() => {
                    setStream(s);
                    setDomain([]);
                    const filtered = domainSuggestions.filter(dom => {
                      if (s === 'Science') return [ 'Medical', 
    'Engineering', 
    'NDA',
    'Aviation',
    'Psychology & Coaching',
    'Sports & Fitness Career',
    'Digital Marketing & Branding',
    'Finance & Investments',
    'Entrepreneurship & Startups'
].includes(dom);
                      if (s === 'Commerce') return ['Financial Analyst', 
    'CA', 
    'Bank Manager',
    'Digital Marketing & Branding',
    'Travel & Tourism Careers',
    'Entrepreneurship & Startups',
    'Fashion & Luxury Industry',
    'Finance & Investments'
].includes(dom);
                      if (s === 'Arts') return [ 'Teacher', 
    'UPSC', 
    'Political Advisor',
    'Digital Creator Economy',
    'Creative Media & Entertainment',
    'Event & Experience Management',
    'Psychology & Coaching',
    'Travel & Tourism Careers',
    'Art, Design & Creativity',
    'Entrepreneurship & Startups'
].includes(dom);
                      return false;
                    });
                    setSuggestions(filtered);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Domains */}
        <div className="mb-4">
          <label className="block font-medium mb-2 text-gray-700">Suggested Domains</label>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((d) => (
              <button
                key={d}
                type="button"
                className="bg-blue-100 text-blue-700 px-4 py-1 rounded-md hover:bg-blue-200"
                onClick={() => handleDomainSelect(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Domains */}
        {domain.length > 0 && (
          <div className="mb-4">
            <label className="block font-medium mb-2 text-gray-700">Selected Domains</label>
            <div className="flex flex-wrap gap-2">
              {domain.map((d) => (
                <div key={d} className="bg-green-100 text-green-700 px-3 py-1 rounded-md flex items-center gap-1">
                  {d}
                  <button onClick={() => handleDomainRemove(d)} className="hover:text-red-500">&times;</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Domain Entry */}
        <div className="mb-4">
          <label className="block font-medium mb-1 text-gray-700">Add a Custom Domain</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualDomain}
              onChange={(e) => setManualDomain(e.target.value)}
              placeholder="Type your domain"
              className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="button"
              onClick={handleManualDomainAdd}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="text-center mt-6">
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-md hover:scale-105 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentInfoForm;
