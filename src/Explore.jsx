import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatbaseBot } from './utils/useChatbaseBot';

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

  const [filteredCareers, setFilteredCareers] = useState(careersData);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilter = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredCareers(careersData);
    } else {
      setFilteredCareers(careersData.filter((career) => career.category === category));
    }
  };

  const handleSearch = () => {
    if (!searchTerm) return handleFilter(activeCategory);
    const lower = searchTerm.toLowerCase();
    setFilteredCareers(
      careersData.filter((career) =>
        career.title.toLowerCase().includes(lower) ||
        career.description.toLowerCase().includes(lower)
      )
    );
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 font-[LilitaOne] text-[#0D0D0D]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2c3e50] to-[#34495e] text-white py-10 px-6 sm:px-12 text-center shadow-xl relative">
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute top-5 left-6 sm:left-12 bg-[#34495e] hover:bg-[#2c3e50] text-white px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition"
          aria-label="Back to Dashboard"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 tracking-wide max-w-4xl mx-auto">
          Career Path Explorer
        </h1>
        <p className="text-lg sm:text-2xl mb-6 max-w-3xl mx-auto">
          Discover diverse career opportunities after 10th grade
        </p>
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search careers..."
            className="w-full px-5 sm:px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-indigo-500 shadow-lg text-base sm:text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-800 text-white px-5 py-2 rounded-full shadow-lg text-base sm:text-lg font-semibold transition focus:outline-none focus:ring-4 focus:ring-indigo-400"
            onClick={handleSearch}
            aria-label="Search Careers"
          >
            Search
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 sm:px-12 py-12 max-w-[1200px] mx-auto">
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 px-1 sm:px-0">
          {categories.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleFilter(value)}
              className={`whitespace-nowrap text-sm sm:text-base px-6 py-2 rounded-full font-medium transition shadow-sm border-2 ${
                activeCategory === value
                  ? 'bg-[#34495e] text-white scale-105 shadow-lg'
                  : 'bg-white text-[#34495e] hover:scale-105 hover:bg-[#ecf0f1]'
              }`}
              aria-pressed={activeCategory === value}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Career Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCareers.map((career) => (
            <div
              key={career.id}
              className="card relative h-[420px] perspective transition-all duration-300 hover:shadow-2xl rounded-lg"
            >
              <div className="card-inner w-full h-full transition-transform duration-500 transform-style-preserve-3d hover:rotate-y-180 rounded-lg">
                {/* Front */}
                <div className="card-front absolute w-full h-full backface-hidden rounded-lg overflow-hidden bg-white shadow-md">
                  <img
                    src={career.image}
                    alt={career.alt}
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-[#34495ecc] text-white text-center py-3 font-semibold text-lg sm:text-xl rounded-b-lg">
                    {career.title}
                  </div>
                </div>
                {/* Back */}
                <div className="card-back absolute w-full h-full backface-hidden rounded-lg bg-white shadow-md p-6 transform rotate-y-180 flex flex-col justify-between overflow-y-auto max-h-[420px]">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold mb-4 text-[#2c3e50]">{career.title}</h3>
                    <p className="mb-4 text-gray-700 text-base sm:text-lg">{career.description}</p>
                    <div className="bg-gray-100 p-3 rounded mb-3">
                      <h4 className="font-semibold text-[#3B4E59] mb-1">Tech Trend:</h4>
                      <p className="text-sm">{career.trend}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded">
                      <h4 className="font-semibold text-[#3B4E59] mb-1">Growth:</h4>
                      <p className="text-sm">{career.booming}</p>
                    </div>
                  </div>
                  <span className="inline-block mt-4 px-4 py-1 text-sm rounded-full bg-[#A6A6A6] text-white self-start">
                    {career.category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Explore;
