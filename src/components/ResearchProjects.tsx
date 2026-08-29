'use client';

import { useState, useEffect, useMemo } from 'react';
import { mergeProjectsWithDefaults, projects } from '@/data/projects';
import { Project } from '@/types';
import ProjectFilter from './ProjectFilter';
import ProjectCard from './ProjectCard';
import ProjectDetailModal from './ProjectDetailModal';

export default function ResearchProjects() {
  const [projectList, setProjectList] = useState<Project[]>(projects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Dynamically extract unique categories
  const categories = useMemo(() => {
    const unique = Array.from(new Set(projectList.map((p) => p.category).filter(Boolean)));
    return unique.length > 0 ? unique : ['Robotics', 'AI', 'Motor Control'];
  }, [projectList]);

  const [activeCategory, setActiveCategory] = useState<string>('Robotics');

  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    const saved = localStorage.getItem('jwl_cms_projects');
    if (saved) {
      try {
        const mergedProjects = mergeProjectsWithDefaults(JSON.parse(saved));
        setProjectList(mergedProjects);
        localStorage.setItem('jwl_cms_projects', JSON.stringify(mergedProjects));
      } catch {
        // fallback
      }
    }
  }, []);

  const filteredProjects = projectList.filter((p) => p.category === activeCategory);

  return (
    <section id="research" className="py-8 px-6">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="text-[28px] font-light text-[#0f172a] mb-3">Research Projects</h2>
        
        <ProjectFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={(cat) => setActiveCategory(cat)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              priority={index === 0}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <p className="text-center text-slate-400 py-12">
            No projects in this category yet.
          </p>
        )}

        {/* Expanded Detail Modal */}
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  );
}
