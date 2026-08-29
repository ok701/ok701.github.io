'use client';

import { useState } from 'react';
import { projects } from '@/data/projects';
import { Project } from '@/types';
import ProjectFilter from './ProjectFilter';
import ProjectCard from './ProjectCard';
import ProjectDetailModal from './ProjectDetailModal';

const CATEGORIES = ['Robotics', 'Embedded'];

export default function ResearchProjects() {
  const [activeCategory, setActiveCategory] = useState<'Robotics' | 'Embedded'>('Robotics');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter((p) => p.category === activeCategory);

  return (
    <section id="research" className="py-8 px-6">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="text-[28px] font-light text-[#0f172a] mb-3">Research Projects</h2>
        
        <ProjectFilter
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={(cat) => setActiveCategory(cat as 'Robotics' | 'Embedded')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
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
