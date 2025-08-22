// Utility to generate synthetic career entries covering beginner to long-term careers

const SAMPLE_IMAGES = [
  '/images/marketing.jpg',
  '/images/finance.jpg',
  '/images/sports.avif',
  '/images/fashion.jpg',
  '/images/food.webp',
  '/images/travel.jpg',
  '/images/physocology.jpg',
  '/images/art.avif',
  '/images/startup.jpg',
  '/images/entertainment-about-us-page-header.jpg',
];

// Categories that match Explore.jsx filters
const CATEGORIES = [
  'digital-creator',
  'media',
  'event',
  'sports',
  'fashion',
  'culinary',
  'travel',
  'marketing',
  'finance',
  'psychology',
  'art',
  'entrepreneurship',
];

const SIMPLE_TRENDS = [
  'AI tools help with research and ideas',
  'Short videos are popular and easy to make',
  'Online learning lets anyone start quickly',
  'Free design tools make projects faster',
  'Mobile-first projects reach more people',
  'Cloud apps help teams work together',
];

const SIMPLE_GROWTH = [
  'Many local and online jobs are growing',
  'More small businesses need this skill',
  'Student-friendly projects are in demand',
  'Freelance work is common and flexible',
  'Beginner roles are opening every year',
];

// Role names expanded by category with beginner to advanced/long-term roles
const ROLES_BY_CATEGORY = {
  'digital-creator': [
    'Content Creator', 'Video Editor', 'Script Writer', 'Thumbnail Designer', 'Social Media Helper',
    'Digital Strategist', 'SEO Specialist', 'Content Marketing Manager', 'Influencer Manager',
    'Digital Media Analyst', 'Brand Partnerships Manager', 'Creative Director', 'Social Media Consultant',
    'Online Community Manager', 'Video Producer', 'Digital Campaign Manager', 'UX Content Designer',
    'E-commerce Content Specialist', 'AI Content Developer', 'Virtual Reality Content Creator'
  ],
  'media': [
    'Podcast Editor', 'Camera Assistant', 'Story Writer', 'Music Mixer', 'Video Producer',
    'Film Director', 'Screenwriter', 'Broadcast Journalist', 'Media Planner',
    'Post-production Supervisor', 'Public Relations Manager', 'Media Research Analyst',
    'Digital Archivist', 'Sound Designer', 'Video Journalist', 'Content Acquisition Manager',
    'Cinematographer', 'Media Consultant', 'Virtual Production Specialist', 'Multimedia Journalist'
  ],
  'event': [
    'Event Planner', 'Stage Crew', 'Light Operator', 'Host/Anchor', 'Logistics Assistant',
    'Event Coordinator', 'Sponsorship Manager', 'Venue Manager', 'Wedding Planner',
    'Exhibition Designer', 'Trade Show Manager', 'Corporate Events Manager', 'Digital Event Producer',
    'Event Marketing Specialist', 'Audio-Visual Technician', 'Exhibitor Relations Manager',
    'Conference Manager', 'Fundraising Coordinator', 'Event Security Manager', 'Experiential Marketing Manager'
  ],
  'sports': [
    'Fitness Coach', 'Sports Writer', 'Score Manager', 'Team Assistant', 'Yoga Helper',
    'Athletic Trainer', 'Sports Psychologist', 'Sports Nutritionist', 'Sports Manager',
    'Sports Analyst', 'Physiotherapist', 'Strength & Conditioning Coach', 'Rehabilitation Specialist',
    'Sports Agent', 'Sports Marketing Manager', 'Coach', 'Scouting Coordinator', 'Kinesiologist',
    'Adventure Tourism Guide', 'Sports Event Organizer'
  ],
  'fashion': [
    'Fashion Blogger', 'Style Assistant', 'Catalog Photographer', 'Model Coordinator', 'Fabric Researcher',
    'Fashion Designer', 'Textile Designer', 'Fashion Merchandiser', 'Fashion Buyer',
    'Stylist', 'Visual Merchandiser', 'Fashion Marketing Manager', 'Costume Designer',
    'Fashion Illustrator', 'Trend Forecaster', 'Pattern Maker', 'Quality Manager', 'Fashion Journalist',
    'Luxury Brand Manager', 'Fashion Production Manager'
  ],
  'culinary': [
    'Recipe Creator', 'Kitchen Assistant', 'Food Photographer', 'Bakery Helper', 'Nutrition Guide',
    'Sous Chef', 'Pastry Chef', 'Culinary Instructor', 'Food Scientist',
    'Restaurant Manager', 'Menu Planner', 'Catering Manager', 'Food Safety Specialist',
    'Nutrition Consultant', 'Food Stylist', 'Chef de Cuisine', 'Sommelier', 'Food Product Developer',
    'Gastronomy Researcher', 'Culinary Entrepreneur'
  ],
  'travel': [
    'Travel Blogger', 'Trip Planner', 'Tour Guide Assistant', 'Photo Curator', 'Map Researcher',
    'Travel Agent', 'Tour Operator', 'Travel Consultant', 'Destination Manager',
    'Airline Customer Service', 'Hotel Manager', 'Cruise Director', 'Travel Policy Analyst',
    'Ecotourism Specialist', 'Cultural Heritage Coordinator', 'Travel Writer', 'Travel Photographer',
    'Adventure Travel Guide', 'Global Mobility Specialist', 'Travel Marketing Manager'
  ],
  'marketing': [
    'Social Media Marketer', 'Brand Assistant', 'Ad Copy Writer', 'SEO Helper', 'Email Marketer',
    'Marketing Analyst', 'Content Strategist', 'Product Marketing Manager', 'Market Researcher',
    'Digital Marketing Manager', 'Marketing Communications Manager', 'Growth Hacker',
    'Customer Insights Analyst', 'Affiliate Marketing Specialist', 'Campaign Manager',
    'Brand Manager', 'CRM Specialist', 'Media Buyer', 'Event Marketing Manager', 'Marketing Consultant'
  ],
  'finance': [
    'Budget Planner', 'Money Tracker', 'Market Researcher', 'Excel Assistant', 'Crypto Basics Learner',
    'Financial Analyst', 'Stock Broker', 'Portfolio Manager', 'Risk Analyst',
    'Compliance Officer', 'Investment Banker', 'Treasury Analyst', 'Credit Analyst',
    'Financial Planner', 'Scheme Provider', 'Tax Consultant', 'Wealth Manager',
    'Fund Manager', 'Corporate Finance Analyst', 'Quantitative Analyst', 'Actuary', 'Audit Manager',
    'Financial Controller', 'Commercial Banker', 'Asset Manager', 'Forex Trader', 'Private Equity Analyst',
    'Venture Capital Analyst', 'Mortgage Advisor', 'Insurance Underwriter', 'Retail Banker',
    'Financial Advisor', 'Investment Consultant', 'Pension Fund Manager', 'Financial Software Developer',
    'Blockchain Analyst', 'Debt Analyst', 'Equity Research Analyst', 'Hedge Fund Manager',
    'Risk Manager', 'Derivatives Trader', 'Economic Analyst', 'Capital Markets Analyst', 'Credit Risk Modeler'
  ],
  'psychology': [
    'Peer Listener', 'Motivation Writer', 'Habit Coach', 'Study Skills Guide', 'Stress Support Assistant',
    'Clinical Psychologist', 'Counseling Psychologist', 'School Psychologist', 'Neuropsychologist',
    'Industrial-Organizational Psychologist', 'Health Psychologist', 'Forensic Psychologist',
    'Sports Psychologist', 'Rehabilitation Counselor', 'Marriage and Family Therapist',
    'Behavioral Analyst', 'Mental Health Counselor', 'Child Psychologist', 'Research Psychologist',
    'Psychiatric Technician'
  ],
  'art': [
    'Graphic Designer', 'Illustration Helper', 'Poster Maker', 'Logo Beginner', 'Photo Editor',
    'Animator', 'Fine Artist', 'Art Director', 'Concept Artist',
    'Gallery Curator', 'Digital Illustrator', 'Visual Effects Artist', 'Photographer',
    'Art Educator', 'Muralist', 'Printmaker', 'Tattoo Artist', 'Sculptor', 'Textile Artist',
    'Art Therapist'
  ],
  'entrepreneurship': [
    'Startup Helper', 'Idea Researcher', 'Sales Assistant', 'Customer Support', 'Product Tester',
    'Business Development Manager', 'Startup Founder', 'Venture Capital Analyst', 'Innovation Manager',
    'Operations Manager', 'Marketing Strategist', 'Financial Planner', 'Growth Hacker',
    'Project Manager', 'Business Analyst', 'Angel Investor', 'E-commerce Entrepreneur',
    'Social Entrepreneur', 'Lean Startup Coach', 'Scaleup Consultant'
  ],
};

// Title templates that are friendly and clear for grades 9–12 and beyond
const TITLE_TEMPLATES = [
  'Junior {role}',
  '{role} Assistant',
  'Student {role}',
  '{role} Intern',
  'Beginner {role}',
  '{role}',
  'Senior {role}',
  'Lead {role}',
  'Chief {role}',
  'Head {role}'
];

function pick(arr, i) {
  return arr[i % arr.length];
}

export function generateSyntheticCareers(count = 1200, startId = 100) {
  const items = [];
  let index = 0;
  while (items.length < count) {
    const category = pick(CATEGORIES, index);
    const roles = ROLES_BY_CATEGORY[category] || ['Career Explorer'];
    // We cycle through roles by incrementing roleIndex each full category cycle
    const roleIndex = Math.floor(index / CATEGORIES.length) % roles.length;
    const role = roles[roleIndex];
    const titleTemplate = TITLE_TEMPLATES[index % TITLE_TEMPLATES.length];
    const title = titleTemplate.replace('{role}', role);
    const image = pick(SAMPLE_IMAGES, index);
    const trend = pick(SIMPLE_TRENDS, index);
    const growth = pick(SIMPLE_GROWTH, index);

    items.push({
      id: startId + index,
      title,
      description: `Learn what a ${role} does with simple projects and grow your skills from beginner to expert level.`,
      category,
      trend,
      booming: growth,
      image,
      alt: `${role} illustration`,
    });

    index++;
  }
  return items;
}

export default generateSyntheticCareers;
