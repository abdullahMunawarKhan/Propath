// Utility to generate synthetic, easy-to-read career entries for students
// in grades 9–12. Keeps language simple and follows the Explore card pattern.

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

// Title templates that are friendly and clear for grades 9–12
const TITLE_TEMPLATES = [
  'Junior {role}',
  '{role} Assistant',
  'Student {role}',
  '{role} Intern',
  'Beginner {role}',
];

// Role names by category
const ROLES_BY_CATEGORY = {
  'digital-creator': [
    'Content Creator', 'Video Editor', 'Script Writer', 'Thumbnail Designer', 'Social Media Helper'
  ],
  'media': [
    'Podcast Editor', 'Camera Assistant', 'Story Writer', 'Music Mixer', 'Video Producer'
  ],
  'event': [
    'Event Planner', 'Stage Crew', 'Light Operator', 'Host/Anchor', 'Logistics Assistant'
  ],
  'sports': [
    'Fitness Coach', 'Sports Writer', 'Score Manager', 'Team Assistant', 'Yoga Helper'
  ],
  'fashion': [
    'Fashion Blogger', 'Style Assistant', 'Catalog Photographer', 'Model Coordinator', 'Fabric Researcher'
  ],
  'culinary': [
    'Recipe Creator', 'Kitchen Assistant', 'Food Photographer', 'Bakery Helper', 'Nutrition Guide'
  ],
  'travel': [
    'Travel Blogger', 'Trip Planner', 'Tour Guide Assistant', 'Photo Curator', 'Map Researcher'
  ],
  'marketing': [
    'Social Media Marketer', 'Brand Assistant', 'Ad Copy Writer', 'SEO Helper', 'Email Marketer'
  ],
  'finance': [
    'Budget Planner', 'Money Tracker', 'Market Researcher', 'Excel Assistant', 'Crypto Basics Learner'
  ],
  'psychology': [
    'Peer Listener', 'Motivation Writer', 'Habit Coach', 'Study Skills Guide', 'Stress Support Assistant'
  ],
  'art': [
    'Graphic Designer', 'Illustration Helper', 'Poster Maker', 'Logo Beginner', 'Photo Editor'
  ],
  'entrepreneurship': [
    'Startup Helper', 'Idea Researcher', 'Sales Assistant', 'Customer Support', 'Product Tester'
  ],
};

function pick(arr, i) {
  return arr[i % arr.length];
}

export function generateSyntheticCareers(count = 1000, startId = 100) {
  const items = [];
  for (let i = 0; i < count; i += 1) {
    const category = pick(CATEGORIES, i);
    const roles = ROLES_BY_CATEGORY[category] || ['Career Explorer'];
    const role = pick(roles, Math.floor(i / CATEGORIES.length));
    const title = TITLE_TEMPLATES[i % TITLE_TEMPLATES.length].replace('{role}', role);
    const image = pick(SAMPLE_IMAGES, i);
    const trend = pick(SIMPLE_TRENDS, i);
    const growth = pick(SIMPLE_GROWTH, i);

    items.push({
      id: startId + i,
      title,
      description: `Learn what a ${role} does with simple projects. Start small, practice daily, and build confidence.`,
      category,
      trend,
      booming: growth,
      image,
      alt: `${role} illustration`,
    });
  }
  return items;
}

export default generateSyntheticCareers;


