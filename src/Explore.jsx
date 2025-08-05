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
    <div className="min-h-screen bg-gradient-to-br from-[#e0c3fc] to-[#f9c2ff] font-[LilitaOne] text-[#0D0D0D]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2c3e50] to-[#34495e] text-white py-10 px-4 text-center shadow-xl relative">
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute top-4 left-4 bg-gray-700 text-white px-3 py-1.5 rounded hover:bg-gray-800 text-sm sm:px-4 sm:py-2 sm:text-base"
        >
          ← Back
        </button>
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 tracking-wide">Career Path Explorer</h1>
        <p className="text-lg sm:text-2xl mb-6">Discover diverse career opportunities after 10th grade</p>
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search careers..."
            className="w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-gray-800 focus:outline-none shadow-xl text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="absolute right-2 top-2 sm:top-2.5 bg-indigo-500 hover:bg-indigo-700 text-white px-3 sm:px-4 py-1 rounded-full text-sm shadow"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="px-4 sm:px-6 py-10">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 text-[#2c3e50]">Explore Career Options</h2>
          <p className="text-sm sm:text-lg text-gray-700 max-w-2xl mx-auto">
            Your 10th grade results don't define your future. Explore careers that match your interests and skills.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 px-1">
          {categories.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleFilter(value)}
              className={`text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2 rounded-full transition border-2 border-[#34495e] shadow-sm ${
                activeCategory === value
                  ? 'bg-[#34495e] text-white scale-105'
                  : 'bg-white text-[#34495e] hover:scale-105 hover:bg-[#ecf0f1]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career) => (
            <div
              key={career.id}
              className="card relative h-[400px] sm:h-[420px] perspective transition-all duration-300 hover:shadow-2xl"
            >
              <div className="card-inner w-full h-full transition-transform duration-500 transform-style-preserve-3d hover:rotate-y-180">
                {/* Front */}
                <div className="card-front absolute w-full h-full backface-hidden rounded-lg overflow-hidden bg-white shadow-md">
                  <img src={career.image} alt={career.alt} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-[#34495ecc] text-white text-center py-2 font-semibold text-base sm:text-lg">
                    {career.title}
                  </div>
                </div>
                {/* Back */}
                <div className="card-back absolute w-full h-full backface-hidden rounded-lg bg-white shadow-md p-4 transform rotate-y-180 flex flex-col justify-between overflow-y-auto max-h-[400px]">
                  <div>
                    <h3 className="text-base sm:text-xl font-bold mb-2 text-[#2c3e50]">{career.title}</h3>
                    <p className="mb-3 text-gray-600 text-sm">{career.description}</p>
                    <div className="bg-gray-100 p-2 rounded mb-2">
                      <h4 className="font-semibold text-[#3B4E59] text-sm">Tech Trend:</h4>
                      <p className="text-xs">{career.trend}</p>
                    </div>
                    <div className="bg-gray-100 p-2 rounded">
                      <h4 className="font-semibold text-[#3B4E59] text-sm">Growth:</h4>
                      <p className="text-xs">{career.booming}</p>
                    </div>
                  </div>
                  <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-[#A6A6A6] text-white self-start">
                    {career.category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#2c3e50] to-[#34495e] text-white py-4 text-center text-sm sm:text-base">
        © 2025 ProPath – All Rights Reserved
      </footer>
    </div>
  );
};

export default Explore;
