import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Destructure passed-in state
  const { answers = [], assessment_domains = [] } = state || {};

  const [saving, setSaving] = useState(false);

  // Redirect back to dashboard if no state
  useEffect(() => {
    if (!state) {
      navigate('/dashboard');
    }
  }, [state, navigate]);

  // Optional: Persist detailed answers if needed
  const handleSaveDetails = async () => {
    setSaving(true);
    try {
      const user = await supabase.auth.getUser().then(res => res.data.user);
      if (!user) throw new Error('Not authenticated');

      // Insert detailed answers along with domains (optional)
      const { error } = await supabase
        .from('quiz_results_details')
        .insert([{ 
          user_id: user.id,
          answers,
          assessment_domains,
          created_at: new Date(),
        }]);

      if (error) {
        console.error('Save details failed:', error);
        alert('Failed to save detailed results.');
      } else {
        alert('Details saved successfully.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Quiz Results</h1>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Top Domains</h2>
          {assessment_domains.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600">
              {assessment_domains.map((domain, idx) => (
                <li key={idx}>{domain}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No domains identified.</p>
          )}
        </div>



        <div className="flex justify-between pt-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Back to Dashboard
          </button>

          <button
            onClick={handleSaveDetails}
            disabled={saving}
            className={`px-6 py-2 rounded-lg ${
              saving ? 'bg-blue-200 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {saving ? 'Saving...' : 'Save Details'}
          </button>
        </div>
      </div>
    </div>
);

};

export default Result;
