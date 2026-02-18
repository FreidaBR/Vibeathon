// Demo mode - returns mock data without calling OpenAI API
// Enable by setting DEMO_MODE=true in server/.env

export function isDemoMode() {
  return process.env.DEMO_MODE === 'true';
}

export const MOCK_DREAM_ROLE = {
  role: 'Full Stack Developer',
  level: 'Mid',
  summary: 'Full stack developers build complete web applications with both frontend and backend components. They work across the entire software development lifecycle.',
  requiredSkills: [
    'Full-stack development',
    'REST API design',
    'Database design',
    'User authentication',
    'Version control',
    'Responsive web design',
    'Performance optimization',
    'Security best practices',
    'Debugging',
    'Testing',
  ],
  technicalSkills: [
    'Frontend development',
    'Backend development',
    'Database management',
    'Cloud computing',
    'API development',
  ],
  softSkills: [
    'Problem solving',
    'Communication',
    'Team collaboration',
    'Time management',
    'Adaptability',
  ],
  tools: [
    'Git',
    'Docker',
    'AWS/GCP/Azure',
    'Postman',
    'VS Code',
    'npm/yarn',
    'Webpack',
  ],
  frameworks: [
    'React',
    'Node.js/Express',
    'Vue.js',
    'Angular',
    'Django',
    'MongoDB',
    'PostgreSQL',
  ],
  languages: ['JavaScript', 'Python', 'SQL', 'HTML', 'CSS'],
  experience: '2-4 years',
  avgSalary: '$100,000 - $150,000',
  growthPath: 'Senior Full Stack Developer → Tech Lead → Engineering Manager',
};

export const MOCK_RESUME_SKILLS = {
  skills: ['Project Management', 'Problem Solving', 'Communication'],
  languages: ['JavaScript', 'Python', 'HTML', 'CSS'],
  tools: ['Git', 'VS Code', 'npm'],
  frameworks: ['React', 'Node.js'],
  extracurricular: ['Bootcamp Graduate', 'GitHub Contributions', 'Personal Projects'],
};

export const MOCK_ROADMAP = [
  {
    title: 'Master Express.js Backend Framework',
    description: 'Deep dive into Express.js to build robust REST APIs. Create a Todo API with CRUD operations, proper error handling, and middleware. Deploy to Heroku to understand production environments.',
    days: 4,
  },
  {
    title: 'Learn SQL & Database Design',
    description: 'Study PostgreSQL fundamentals and relational database design. Migrate your Todo app from file storage to PostgreSQL. Learn joins, indexes, and optimization.',
    days: 5,
  },
  {
    title: 'Build Full Stack Todo Application',
    description: 'Integrate your React frontend with Express backend and PostgreSQL database. Implement user authentication with JWT. Add real-time updates with WebSockets.',
    days: 5,
  },
  {
    title: 'Learn Docker & Containerization',
    description: 'Containerize your full stack app using Docker. Create Dockerfile for backend, database, and frontend. Use Docker Compose to orchestrate multi-container application.',
    days: 3,
  },
  {
    title: 'Deploy to AWS/Cloud Platform',
    description: 'Deploy your Dockerized app to AWS (EC2 or ECS), Google Cloud, or DigitalOcean. Set up CloudFront CDN for frontend. Learn CI/CD pipelines with GitHub Actions.',
    days: 4,
  },
  {
    title: 'Implement Advanced Authentication',
    description: 'Upgrade beyond basic JWT. Implement OAuth2 with Google/GitHub login. Add password reset, 2FA, and role-based access control (RBAC).',
    days: 4,
  },
  {
    title: 'Learn Vue.js Framework',
    description: 'Since you know React, pick up Vue.js to expand job market reach. Build the same Todo app in Vue to compare paradigms. Understand Vue composition API.',
    days: 3,
  },
  {
    title: 'Master Testing (Jest & React Testing)',
    description: 'Write unit tests for your React components. Add integration tests for your API. Aim for >80% test coverage. Learn about test-driven development (TDD).',
    days: 4,
  },
  {
    title: 'Update GitHub Portfolio with Projects',
    description: 'Refactor your best projects for portfolio. Add comprehensive README files, deployment links, and tech stacks. Pin 3-4 impressive projects on your GitHub profile.',
    days: 2,
  },
  {
    title: 'Contribute to Open Source Project',
    description: 'Find beginner-friendly open source repos. Submit 2-3 meaningful pull requests. Learn team workflow, code reviews, and collaboration. Highlight in resume and portfolio.',
    days: 5,
  },
  {
    title: 'Build E-Commerce Project for Portfolio',
    description: 'Create a full e-commerce app with product catalog, shopping cart, payment integration (Stripe), and admin dashboard. Use all skills: React, Node, PostgreSQL, Docker.',
    days: 6,
  },
  {
    title: 'Learn System Design & Scalability',
    description: 'Study database scaling, caching strategies (Redis), load balancing, and microservices. Design high-level architecture for typical startup apps.',
    days: 4,
  },
  {
    title: 'Write Technical Blog Posts',
    description: 'Document your learning journey. Write 3 posts about: "Building REST APIs with Express", "React Hooks Best Practices", and "Docker for Beginners". Publish on Medium or Dev.to.',
    days: 3,
  },
  {
    title: 'Network & Connect with Industry Professionals',
    description: 'Attend meetups or online webinars. Reach out to 10 full stack developers on LinkedIn. Mention specific projects of theirs. Build genuine connections in tech community.',
    days: 3,
  },
  {
    title: 'Apply to Junior/Mid-Level Full Stack Roles',
    description: 'Target 5-10 companies per week. Customize cover letter mentioning specific projects. Prepare for technical interviews using LeetCode. Follow up after 1 week if no response.',
    days: 7,
  },
];
