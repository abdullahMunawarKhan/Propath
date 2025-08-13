import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatbaseBot } from './utils/useChatbaseBot';
import { supabase } from './utils/supabase';
import { generateSyntheticCareers } from './utils/generateCareers';

const careersData = [
  {
    id: 1,
    title: "Digital Creator Economy",
    description: "Content creators, influencers, and digital educators building audiences on YouTube, Instagram, or podcasts.",
    category: "digital-creator",
    trend: "AI-driven content creation (using AI tools like Midjourney, ChatGPT for content ideas and video scripting).",
    booming: "Expected 20% yearly growth with 100+ billion dollar market value.",
    image: "../images/digital-creator1-ae338247.jpeg",
    alt: "Content creator recording a video",
  },
  {
    id: 2,
    title: "Creative Media & Entertainment",
    description: "Careers in filmmaking, OTT content writing, music production, or digital storytelling.",
    category: "media",
    trend: "Virtual production (like Unreal Engine), AI-based video editing, and deepfake technologies revolutionizing media.",
    booming: "Global entertainment market expected to reach $3 trillion by 2030.",
    image: "../images/entertainment-about-us-page-header.jpg",
    alt: "Filmmaker directing a scene",
  },
];

const Explore = () => {
  const navigate = useNavigate();
  useChatbaseBot();

  const [allCareers, setAllCareers] = useState(careersData);
  const [filteredCareers, setFilteredCareers] = useState(careersData);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [aiLoaded, setAiLoaded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(18); // incremental pagination

  const handleFilter = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredCareers(allCareers);
    } else {
      setFilteredCareers(allCareers.filter((career) => career.category === category));
    }
    setVisibleCount(18);
  };

  const handleSearch = () => {
    if (!searchTerm) return handleFilter(activeCategory);
    const lower = searchTerm.toLowerCase();
    setFilteredCareers(
      allCareers.filter((career) =>
        career.title.toLowerCase().includes(lower) ||
        career.description.toLowerCase().includes(lower)
      )
    );
    setVisibleCount(18);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const categories = [
    { label: 'All', value: 'all' },
    { label: 'Digital Creator Economy', value: 'digital-creator' },
    { label: 'Creative Media & Entertainment', value: 'media' },
    { label: 'Event & Experience Management', value: 'event' },
    { label: 'Sports & Fitness Careers', value: 'sports' },
    { label: 'Fashion & Luxury Industry', value: 'fashion' },
    { label: 'Culinary Arts & Food Innovation', value: 'culinary' },
    { label: 'Travel & Tourism Careers', value: 'travel' },
    { label: 'Digital Marketing & Branding', value: 'marketing' },
    { label: 'Finance & Investments', value: 'finance' },
    { label: 'Psychology & Coaching', value: 'psychology' },
    { label: 'Art, Design & Creativity', value: 'art' },
    { label: 'Entrepreneurship & Startups', value: 'entrepreneurship' },
  ];

  // Memoized currently visible slice for performance
  const visibleCareers = useMemo(() => filteredCareers.slice(0, visibleCount), [filteredCareers, visibleCount]);

  const loadAiCareers = () => {
    if (aiLoaded) return;
    const generated = generateSyntheticCareers(1000, 1000);
    const merged = [...careersData, ...generated];
    setAllCareers(merged);
    // Re-apply current filter/search on the new dataset
    setAiLoaded(true);
    if (activeCategory !== 'all') {
      setFilteredCareers(merged.filter(c => c.category === activeCategory));
    } else if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      setFilteredCareers(merged.filter(c => c.title.toLowerCase().includes(lower) || c.description.toLowerCase().includes(lower)));
    } else {
      setFilteredCareers(merged);
    }
    setVisibleCount(30);
  };

  // Auto-load AI careers and default to "My Selected Domains" on first visit
  useEffect(() => {
    const init = async () => {
      loadAiCareers();
      await filterByMySelectedDomains();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map student info domains to Explore categories
  const studentDomainToCategory = (d) => {
    const map = {
      'Creative Media & Entertainment': 'media',
      'Sports & Fitness Career': 'sports',
      'Sports & Fitness Careers': 'sports',
      'Fashion & Luxury Industry': 'fashion',
      'Culinary Arts & Food Innovation': 'culinary',
      'Art, Design & Creativity': 'art',
      'Financial Analyst': 'finance',
      'CA': 'finance',
      'Bank Manager': 'finance',
      'Digital Marketing & Branding': 'marketing',
      'Aviation': 'travel',
      'Teacher': 'psychology',
      'Medical': 'psychology',
      'Engineering': 'entrepreneurship',
      'UPSC': 'media',
      'Political Advisor': 'media',
      'Army': 'sports',
      'Police': 'sports',
      'Entrepreneurship & Startups': 'entrepreneurship',
    };
    return map[d];
  };

  const filterByMySelectedDomains = async () => {
    try {
      // Ensure big dataset is present
      if (!aiLoaded) loadAiCareers();

      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!userId) {
        alert('Please log in to view your selected domains.');
        return;
      }
      const { data, error } = await supabase.from('students').select('domain').eq('user_id', userId).single();
      if (error) {
        console.error('Failed to load your domains:', error.message);
        return;
      }
      const domains = data?.domain || [];
      const mappedCats = new Set(domains.map(studentDomainToCategory).filter(Boolean));
      if (mappedCats.size === 0) {
        // Fallback: show general skill areas if we cannot map
        setFilteredCareers(allCareers.filter(c => ['marketing','entrepreneurship','art','media'].includes(c.category)));
      } else {
        setFilteredCareers(allCareers.filter(c => mappedCats.has(c.category)));
      }
      setActiveCategory('my');
      setVisibleCount(24);
    } catch (e) {
      console.error('Unexpected error fetching selected domains:', e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Back to Dashboard"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Career Explorer</h1>
                <p className="text-gray-600 text-sm sm:text-base">Discover diverse career opportunities after 10th grade</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Search careers..."
                className="w-full px-4 py-2 pl-10 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                onClick={handleSearch}
                aria-label="Search Careers"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h2>
          <div className="flex flex-wrap gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <button
              onClick={filterByMySelectedDomains}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                activeCategory === 'my'
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md hover:scale-105 border border-gray-200'
              }`}
              aria-pressed={activeCategory === 'my'}
            >
              My Selected Domains
            </button>
            {categories.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleFilter(value)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  activeCategory === value
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md hover:scale-105 border border-gray-200'
                }`}
                aria-pressed={activeCategory === value}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-gray-600">
            Showing {filteredCareers.length} career{filteredCareers.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={loadAiCareers}
              disabled={aiLoaded}
              className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                aiLoaded ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
              title="Generate 1000 student-friendly career ideas"
            >
              {aiLoaded ? 'AI Careers Loaded' : 'Load AI Careers (1000)'}
            </button>
          </div>
        </div>

        {/* Career Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCareers.map((career) => (
            <div
              key={career.id}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-white/20 overflow-hidden transition-all duration-300 hover:scale-105"
            >
              {/* Card Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={career.image}
                  alt={career.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-white mb-1">{career.title}</h3>
                  <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-lg">
                    {career.category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{career.description}</p>
                
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <h4 className="font-semibold text-blue-800 text-sm mb-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Tech Trend
                    </h4>
                    <p className="text-blue-700 text-xs">{career.trend}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-3">
                    <h4 className="font-semibold text-green-800 text-sm mb-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Growth
                    </h4>
                    <p className="text-green-700 text-xs">{career.booming}</p>
                  </div>
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        {visibleCount < filteredCareers.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount((c) => c + 24)}
              className="px-6 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium"
            >
              Load more
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredCareers.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No careers found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No careers match your search for "${searchTerm}". Try different keywords or browse all categories.`
                : 'No careers available in this category. Please try another category.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
