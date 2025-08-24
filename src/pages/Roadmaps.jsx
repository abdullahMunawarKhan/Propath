import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import jsPDF from 'jspdf';
import { useChatbaseBot } from '../utils/useChatbaseBot';

const Roadmaps = () => {
  useChatbaseBot();
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [roadmaps, setRoadmaps] = useState({}); // { domain: [steps] }
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user domains from Supabase on mount
  useEffect(() => {
    (async () => {
      const user = await supabase.auth.getUser();
      const userId = user?.data?.user?.id;
      const { data, error } = await supabase
        .from('students')
        .select('domain')
        .eq('user_id', userId)
        .single();
      if (!error && data?.domain) {
        setSelectedDomains(data.domain);
      }
      setLoading(false);
    })();
  }, []);

  // Fetch roadmap for each selected domain from backend API
  useEffect(() => {
    if (selectedDomains.length === 0) return;

    const fetchRoadmap = async (domain) => {
      try {
        const res = await fetch(`/api/roadmap?domain=${encodeURIComponent(domain)}`);
        const json = await res.json();
        return json.roadmap || [];
      } catch {
        return [];
      }
    };

    (async () => {
      setLoading(true);
      const roads = {};
      for (const domain of selectedDomains) {
        roads[domain] = await fetchRoadmap(domain);
      }
      setRoadmaps(roads);
      setLoading(false);
    })();
  }, [selectedDomains]);

  const handleSaveRoadmaps = async () => {
    const user = await supabase.auth.getUser();
    const userId = user?.data?.user?.id;

    const roadmapPoints = {};
    selectedDomains.forEach(domain => {
      roadmapPoints[domain] = roadmaps[domain] || [];
    });

    const { error } = await supabase.from('saved_roadmaps').insert({
      user_id: userId,
      domains: selectedDomains,
      roadmap_points: roadmapPoints,
    });

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Career Roadmaps', 14, 20);

    let y = 30;
    selectedDomains.forEach((domain, idx) => {
      doc.setFontSize(14);
      doc.text(`${idx + 1}. ${domain}`, 14, y);
      y += 8;

      (roadmaps[domain] || []).forEach((step) => {
        doc.setFontSize(12);
        doc.text(`- ${step}`, 18, y);
        y += 6;
      });

      y += 10;
    });

    doc.save('career_roadmaps.pdf');
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '24px', background: '#f7f7fb', borderRadius: 12 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Your Selected Career Roadmaps</h2>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#888', margin: '40px 0' }}>
          Loading...
        </div>
      ) : selectedDomains.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', margin: '40px 0' }}>
          No career domains selected yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {selectedDomains.map((domain) => (
            <div
              key={domain}
              style={{
                flex: '1 1 320px',
                background: 'white',
                borderRadius: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                marginBottom: 20,
                padding: 20,
                minWidth: 280
              }}
            >
              <h3 style={{ color: '#6a38c7', marginBottom: 10 }}>{domain}</h3>
              <ol style={{ paddingLeft: 20, color: '#444', margin: 0 }}>
                {(roadmaps[domain] || []).length === 0 ? (
                  <li style={{ color: '#999' }}>No roadmap found.</li>
                ) : (
                  (roadmaps[domain] || []).map((step, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>{step}</li>
                  ))
                )}
              </ol>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 40 }}>
        <button
          onClick={handleSaveRoadmaps}
          disabled={selectedDomains.length === 0 || loading}
          style={{
            background: '#6a38c7', color: 'white', border: 0, borderRadius: 5, padding: '10px 24px', fontSize: 16, cursor: 'pointer', opacity: loading ? 0.6 : 1
          }}
        >
          Save Roadmaps
        </button>
        <button
          onClick={handleExportPDF}
          disabled={selectedDomains.length === 0 || loading}
          style={{
            background: '#fff',
            color: '#6a38c7',
            border: '1px solid #6a38c7',
            borderRadius: 5,
            padding: '10px 24px',
            fontSize: 16,
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          Export PDF
        </button>
      </div>

      {saved && (
        <div style={{
          marginTop: 20,
          textAlign: 'center',
          color: '#43a047',
          fontWeight: 'bold',
          fontSize: 18
        }}>
          Roadmaps saved successfully!
        </div>
      )}
    </div>
  );
};

export default Roadmaps;
