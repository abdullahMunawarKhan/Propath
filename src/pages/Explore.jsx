import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatbaseBot } from '../utils/useChatbaseBot';// adjust import if needed
import { supabase } from '../utils/supabase';
import { generateSyntheticCareers } from '../utils/generateCareers';

// Local images mapped per domain with arrays of image paths
const domainImages = {
  'digital-creator': [
    '/images/digital-creator1.jpeg',
    '/images/digital-creator2.jpg',
    '/images/digital-creator3.jpg',
    '/images/digital-creator4.png',
    '/images/digital-creator5.png',
    '/images/digital-creator6.png',
  ],
  media: [
    '/images/media1.png',
    '/images/media2.png',
    '/images/media3.png',
    '/images/media4.png',
    '/images/media5.png',
    '/images/media6.png',
  ],
  event: [
    '/images/event1.png',
    '/images/event2.png',
    '/images/event3.png',
    '/images/event4.png',
    '/images/event5.png',
    '/images/event6.png',
  ],
  sports: [
    '/images/sports1.png',
    '/images/sports2.png',
    '/images/sports3.png',
    '/images/sports4.png',
    '/images/sports5.png',
    '/images/sports6.png',
  ],
  fashion: [
    '/images/fashion1.png',
    '/images/fashion2.png',
    '/images/fashion3.png',
    '/images/fashion4.png',
    '/images/fashion5.png',
    '/images/fashion6.png',
  ],
  culinary: [
    '/images/culinary1.png',
    '/images/culinary2.png',
    '/images/culinary3.png',
    '/images/culinary4.png',

  ],
  travel: [
    '/images/travel1.jpg',
    '/images/travel2.png',
    '/images/travel3.png',
    '/images/travel4.png',
    '/images/travel5.png',
    
  ],
  marketing: [
    '/images/marketing1.png',
    '/images/marketing2.png',
    '/images/marketing3.png',
    '/images/marketing4.jpg',

  ],
  finance: [
    '/images/finance1.jpg',
    '/images/finance2.png',
    '/images/finance3.png',
    '/images/finance4.png',
    '/images/finance5.png',
  ],
  psychology: [
    '/images/psychology.jpg',
    
  ],
  art: [
    '/images/art1.png',
    '/images/art2.png',
    '/images/art3.png',

  ],
  entrepreneurship: [
    '/images/entrepreneurship1.png',
    '/images/entrepreneurship2.png',
    '/images/entrepreneurship3.png',
 
  ],
};

// Utility to cycle through domain images per career ID
const pickImage = (arr, id) => arr[id % arr.length] || '/images/placeholder.jpg';

// Static careers to start with
const careersStatic = [
  {
    id: 1,
    title: 'Digital Creator Economy',
    description:
      'Content creators, influencers, and digital educators building audiences on YouTube, Instagram, or podcasts.',
    category: 'digital-creator',
    trend: 'AI tools and video editing software transforming content creation.',
    booming: 'Projected 20% growth over the next 10 years.',
    alt: 'Digital Creator',
  },
  {
    id: 2,
    title: 'Creative Media',
    description:
      'Careers in filmmaking, writing, and media production.',
    category: 'media',
    trend: 'Virtual production and streaming platforms expanding opportunities.',
    booming: 'Global entertainment market growing rapidly.',
    alt: 'Media',
  },
];

// Categories list as before

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Digital Creator Economy', value: 'digital-creator' },
  { label: 'Creative Media', value: 'media' },
  { label: 'Event Management', value: 'event' },
  { label: 'Sports Careers', value: 'sports' },
  { label: 'Fashion Industry', value: 'fashion' },
  { label: 'Culinary Arts', value: 'culinary' },
  { label: 'Travel', value: 'travel' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Finance', value: 'finance' },
  { label: 'Psychology', value: 'psychology' },
  { label: 'Art', value: 'art' },
  { label: 'Entrepreneurship', value: 'entrepreneurship' },
];

const Explore = () => {
  const navigate = useNavigate();
  useChatbaseBot();

  const [allCareers, setAllCareers] = useState(careersStatic);
  const [filteredCareers, setFilteredCareers] = useState(careersStatic);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [aiLoaded, setAiLoaded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(18);
  const [showChatHighlight, setShowChatHighlight] = useState(false);


  const handleFilter = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredCareers(allCareers);
    } else {
      setFilteredCareers(allCareers.filter((c) => c.category === category));
    }
    setVisibleCount(18);
  };

  const handleSearch = () => {
    if (!searchTerm) return handleFilter(activeCategory);
    const lower = searchTerm.toLowerCase();
    setFilteredCareers(
      allCareers.filter(
        (career) =>
          career.title.toLowerCase().includes(lower) || career.description.toLowerCase().includes(lower)
      )
    );
    setVisibleCount(18);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const loadAiCareers = () => {
    if (aiLoaded) return;
    const generated = generateSyntheticCareers(1000, 1000);
    const combined = [...careersStatic, ...generated];
    setAllCareers(combined);
    setAiLoaded(true);
    if (activeCategory !== 'all') {
      setFilteredCareers(combined.filter((c) => c.category === activeCategory));
    } else if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      setFilteredCareers(combined.filter((c) => c.title.toLowerCase().includes(lower) || c.description.toLowerCase().includes(lower)));
    } else {
      setFilteredCareers(combined);
    }
    setVisibleCount(30);
  };

  // Domain mapping and user domain filter as before...

  const studentDomainToCategory = (d) => {
    const map = {
      'Digital Creator Economy': 'digital-creator',
      'Creative Media': 'media',
      'Event Management': 'event',
      'Sports Careers': 'sports',
      'Fashion Industry': 'fashion',
      'Culinary Arts': 'culinary',
      'Travel': 'travel',
      'Marketing': 'marketing',
      'Finance': 'finance',
      'Psychology': 'psychology',
      'Art': 'art',
      'Entrepreneurship': 'entrepreneurship',
      // Add your own mappings...
    };
    return map[d];
  };

  const filterByUserDomains = async () => {
    try {
      if (!aiLoaded) loadAiCareers();
      const userData = await supabase.auth.getUser();
      if (!userData.data?.user) {
        alert('Please login to view your domains');
        return;
      }
      const { data: studentData, error } = await supabase
        .from('students')
        .select('domain')
        .eq('user_id', userData.data.user.id)
        .single();
      if (error) throw error;
      const mapped = new Set(studentData.domain.map(studentDomainToCategory).filter(Boolean));
      if (mapped.size === 0) {
        setFilteredCareers(allCareers.filter((c) => ['digital-creator', 'media', 'entrepreneurship', 'art'].includes(c.category)));
      } else {
        setFilteredCareers(allCareers.filter((c) => mapped.has(c.category)));
      }
      setActiveCategory('my');
      setVisibleCount(24);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    filterByUserDomains();
  }, []);

  const visibleCareers = useMemo(() => filteredCareers.slice(0, visibleCount), [filteredCareers, visibleCount]);

  const handleLearnMore = (career) => {
    if (window.chatbase) {
      window.chatbase('open');
      setShowChatHighlight(true);

    // Hide the highlight after 4 seconds
      setTimeout(() => {
        setShowChatHighlight(false);
      }, 4000);
    } else {
      alert('Chatbot not loaded');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-700">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 backdrop-blur flex flex-wrap items-center justify-between px-6 py-4 gap-4">
        <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="grow text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Career Explorer</h1>
          <p className="mt-1 text-lg text-gray-700">Discover diverse career opportunities</p>
        </div>
        <div className="relative w-full max-w-md">
          <input
            type="search"
            placeholder="Search careers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-2 text-gray-700 focus:ring-indigo-500 focus:outline-none"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"  />
            </svg>
          </div>
        </div>
      </div>

      {/* Category tags: wrap not scroll */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-20 px-6 py-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={filterByUserDomains}
            className={`rounded border px-3 py-1 text-sm font-semibold transition-colors ${
              activeCategory === 'my' ? 'bg-indigo-600 text-white' : 'border-indigo-600 text-indigo-700'
            }`}
            aria-pressed={activeCategory === 'my'}
          >My Domains</button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleFilter(cat.value)}
              className={`rounded border px-3 py-1 text-sm font-semibold transition-colors ${
                activeCategory === cat.value ? 'bg-indigo-600 text-white' : 'border-indigo-600 text-indigo-700'
              }`}
              aria-pressed={activeCategory === cat.value}
            >{cat.label}</button>
          ))}
        </div>
      </div>

      {/* Results / Careers */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-700">
            Showing {filteredCareers.length} career{filteredCareers.length !== 1 ? 's' : ''} {searchTerm && <span>for <span className="font-semibold">{searchTerm}</span></span>}
          </p>
          <button
            onClick={loadAiCareers}
            disabled={aiLoaded}
            className={`rounded border px-4 py-2 text-sm font-semibold transition-colors ${
              aiLoaded ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >{aiLoaded ? 'AI Careers Loaded' : 'Load AI Careers'}</button>
        </div>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {visibleCareers.map((career) => (
            <article key={career.id} className="rounded bg-white shadow hover:shadow-md transition p-4">
              <div className="w-full h-[200px] overflow-hidden rounded-t">
                <img
                  src={pickImage(domainImages[career.category], career.id)}
                  alt={career.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
  
              <div className="mt-3">
                <h2 className="text-lg font-semibold text-gray-900 truncate">{career.title}</h2>
                  <span className="inline-block text-sm text-indigo-600 font-medium mt-1">
                    {career.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </span>
              </div>
  
              <p className="mt-2 text-gray-700 line-clamp-3">{career.description}</p>
  
              <div className="grid gap-2 mt-3">
                <div className="bg-blue-50 p-2 rounded text-blue-800 text-sm">
                  <strong>Tech Trend: </strong>{career.trend}
                </div>
                <div className="bg-green-50 p-2 rounded text-green-800 text-sm">
                  <strong>Growth: </strong>{career.booming}
                </div>
              </div>
              <button
                onClick={() => handleLearnMore(career)}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition"
              >
                Learn More
              </button>
  
            </article>
          ))}
        </section>

        {(visibleCareers.length < filteredCareers.length) && (
          <div className="flex justify-center my-10">
            <button
              onClick={() => setVisibleCount((count) => count + 24)}
              className="rounded border border-indigo-500 px-6 py-2 font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              Load More
            </button>
          </div>
        )}

        {filteredCareers.length === 0 && (
          <section className="mt-20 max-w-lg mx-auto text-center text-gray-600">
            <p>No careers found{searchTerm ? ` for "${searchTerm}"` : ''}.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
              }}
              className="mt-6 rounded bg-indigo-600 py-2 px-6 font-semibold text-white hover:bg-indigo-700"
            >
              Clear Search
            </button>
          </section>
        )}
        {showChatHighlight && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-indigo-700 text-white text-lg font-semibold px-6 py-4 rounded shadow-lg opacity-90">
              Enter domain name in chatbot to start your search
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Explore;
