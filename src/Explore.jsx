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
    image: "./images/digital-creator1-ae338247.jpeg",
    alt: "Content creator recording a video",
  },
  {
    id: 2,
    title: "Creative Media & Entertainment",
    description: "Careers in filmmaking, OTT content writing, music production, or digital storytelling.",
    category: "media",
    trend: "Virtual production (like Unreal Engine), AI-based video editing, and deepfake technologies revolutionizing media.",
    booming: "Global entertainment market expected to reach $3 trillion by 2030.",
    image: "./images/entertainment-about-us-page-header.jpg",
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
      <header className="bg-gradient-to-r from-[#2c3e50] to-[#34495e] text-white py-8 text-center shadow-xl">
        <h1 className="text-5xl font-extrabold mb-4 tracking-wide drop-shadow">Career Path Explorer</h1>
        <p className="text-2xl mb-6">Discover diverse career opportunities after completing 10th grade</p>
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search careers (e.g., digital creator...)"
            className="w-full px-6 py-3 rounded-full text-gray-800 focus:outline-none shadow-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="absolute right-2 top-2 bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-1 rounded-full font-bold shadow"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="relative">
          <button
            onClick={() => navigate('/dashboard')}
            className="absolute top-4 left-4 bg-gray-700 text-white px-3 py-1.5 rounded hover:bg-gray-800 text-sm sm:px-4 sm:py-2 sm:text-base shadow"
          >
            ← Back to Dashboard
          </button>

          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4 text-[#2c3e50] drop-shadow">Explore Career Options</h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-700">
              Your 10th grade results don't define your future. Explore these diverse career paths that match your interests and skills.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {categories.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleFilter(value)}
                className={`px-6 py-2 rounded-full transition font-semibold border-2 border-[#34495e] shadow-md hover:shadow-lg ${
                  activeCategory === value
                    ? 'bg-[#34495e] text-white scale-105'
                    : 'bg-white text-[#34495e] hover:scale-105 hover:bg-[#ecf0f1]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCareers.map((career) => (
              <div key={career.id} className="card relative h-[400px] perspective transition-all duration-300 hover:shadow-2xl">
                <div className="card-inner w-full h-full transition-transform duration-500 transform-style-preserve-3d hover:rotate-y-180">
                  <div className="card-front absolute w-full h-full backface-hidden rounded-lg overflow-hidden bg-white shadow-md">
                    <img src={career.image} alt={career.alt} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-[#34495ecc] text-white text-center py-2 font-semibold text-lg">
                      {career.title}
                    </div>
                  </div>
                  <div className="card-back absolute w-full h-full backface-hidden rounded-lg bg-white shadow-md p-4 transform rotate-y-180 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-[#2c3e50]">{career.title}</h3>
                      <p className="mb-3 text-gray-600">{career.description}</p>
                      <div className="bg-gray-100 p-2 rounded mb-2">
                        <h4 className="font-semibold text-[#3B4E59]">Tech Trend:</h4>
                        <p className="text-sm">{career.trend}</p>
                      </div>
                      <div className="bg-gray-100 p-2 rounded">
                        <h4 className="font-semibold text-[#3B4E59]">Growth:</h4>
                        <p className="text-sm">{career.booming}</p>
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
        </div>
      </main>

      <footer className="bg-gradient-to-r from-[#2c3e50] to-[#34495e] text-white py-6 text-center shadow-inner">
        <p className="text-lg">&copy; 2025 Career Path Explorer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Explore;
