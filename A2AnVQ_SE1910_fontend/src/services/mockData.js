// Võ Quốc An - ce190460
export const ROLE = {
  ADMIN: 1,
  STAFF: 2
};

export const STATUS = {
  ACTIVE: 1,
  INACTIVE: 0
};

export const INITIAL_CATEGORIES = [
  { id: 1, name: 'Technology', description: 'Tech news, software engineering & AI advances', status: 1 },
  { id: 2, name: 'Education', description: 'Academic curriculum, exams and learning resources', status: 1 },
  { id: 3, name: 'Campus Life', description: 'Student activities, club events and campus facilities', status: 1 },
  { id: 4, name: 'Sports & Wellness', description: 'Tournaments, sports clubs and student fitness', status: 1 },
  { id: 5, name: 'Archived Announcements', description: 'Old news notices and historical archives', status: 0 }
];

export const INITIAL_USERS = [
  { id: 1, username: 'Admin', fullName: 'System Administrator', email: 'admin@fu.edu.vn', role: 1, status: 1 },
  { id: 2, username: 'staff1', fullName: 'Nguyen Van A', email: 'anv@fu.edu.vn', role: 2, status: 1 },
  { id: 3, username: 'staff2', fullName: 'Tran Thi B', email: 'btt@fu.edu.vn', role: 2, status: 1 },
  { id: 4, username: 'editor_locked', fullName: 'Le Van C', email: 'clv@fu.edu.vn', role: 2, status: 0 }
];

export const INITIAL_NEWS = [
  {
    id: 1,
    title: 'FPT University Launches Next-Gen AI & Robotics Laboratory',
    content: 'The new laboratory features high-performance GPU computing clusters, cutting-edge edge IoT kits, and humanoid robotics workstations for students and researchers.',
    categoryId: 1,
    createdBy: 'Admin',
    status: 1,
    tags: 'AI, Technology, Research',
    createdAt: '2026-10-15'
  },
  {
    id: 2,
    title: 'React 19 Integration with Spring Boot 3 in Modern Enterprise Apps',
    content: 'A comprehensive study on building reactive and decoupled single page applications using React 19 frontend and Spring Boot microservices backend.',
    categoryId: 1,
    createdBy: 'staff1',
    status: 1,
    tags: 'React, SpringBoot, SPA',
    createdAt: '2026-10-18'
  },
  {
    id: 3,
    title: 'Final Examination Schedule for Fall 2026 Semester Released',
    content: 'Academic affairs has published the official exam timetable. Students must bring their student ID cards and comply with exam hall integrity guidelines.',
    categoryId: 2,
    createdBy: 'Admin',
    status: 1,
    tags: 'Exam, Schedule, Academic',
    createdAt: '2026-10-20'
  },
  {
    id: 4,
    title: 'Annual FU Campus Sports Festival: Football & Badminton Registrations Open',
    content: 'Registration is now open for inter-cohort championships. Join clubs and compete for prestigious regional medals and scholarships.',
    categoryId: 4,
    createdBy: 'staff2',
    status: 1,
    tags: 'Sports, Festival, Clubs',
    createdAt: '2026-10-22'
  },
  {
    id: 5,
    title: 'Scheduled Campus Network Maintenance Notice',
    content: 'Campus backbone fiber optic switches will undergo maintenance between 23:00 and 03:00 this weekend. Wireless service may experience brief disconnections.',
    categoryId: 5,
    createdBy: 'Admin',
    status: 0,
    tags: 'Maintenance, IT, Notice',
    createdAt: '2026-10-24'
  }
];

const STORAGE_KEYS = {
  CATEGORIES: 'fu_news_categories',
  NEWS: 'fu_news_articles',
  USERS: 'fu_news_users',
  AUTH: 'fu_news_auth_session'
};

// Helper to safely load data from localStorage with fallback to seed
export const loadStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return fallback;
  }
};

// Helper to save data to localStorage
export const saveStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Reset all mock data to initial default state
export const resetAllMockData = () => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(INITIAL_NEWS));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
};

export { STORAGE_KEYS };
