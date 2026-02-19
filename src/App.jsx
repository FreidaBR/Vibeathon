import { useState, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SkillsSection from './components/SkillsSection';
import RoadmapSection from './components/RoadmapSection';
import Footer from './components/Footer';
import { generateRoadmap } from './lib/api';

function AppContent() {
  const [dreamRole, setDreamRole] = useState(null);
  const [skills, setSkills] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapError, setRoadmapError] = useState(null);
  const [githubUrl, setGitHubUrl] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [profileValidation, setProfileValidation] = useState({ githubValid: false, linkedInValid: false });

  const handleDreamRoleAnalyzed = useCallback((roleData) => {
    setDreamRole(roleData);
  }, []);

  const handleResumeUploaded = useCallback(async (skillsData) => {
    setSkills(skillsData);
    setRoadmapLoading(true);
    setRoadmapError(null);
    try {
      const profileData = {
        ...profileValidation,
        dreamRole: dreamRole,
      };
      const result = await generateRoadmap(skillsData, profileData);
      const milestones = result.milestones || result;
      setRoadmap(Array.isArray(milestones) ? milestones : []);
      setTimeout(() => {
        document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err) {
      setRoadmapError(err.message || 'Failed to generate roadmap');
      setRoadmap(null);
    } finally {
      setRoadmapLoading(false);
    }
  }, [profileValidation, dreamRole]);

  const handleValidationChange = useCallback((updates) => {
    setProfileValidation((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection
        onResumeUploaded={handleResumeUploaded}
        githubUrl={githubUrl}
        linkedInUrl={linkedInUrl}
        onGitHubChange={setGitHubUrl}
        onLinkedInChange={setLinkedInUrl}
        onValidationChange={handleValidationChange}
        uploadComplete={!!skills}
        onDreamRoleAnalyzed={handleDreamRoleAnalyzed}
        dreamRoleAnalyzed={!!dreamRole}
      />
      <SkillsSection skills={skills} dreamRole={dreamRole} />
      <RoadmapSection
        milestones={roadmap}
        loading={roadmapLoading}
        error={roadmapError}
      />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
