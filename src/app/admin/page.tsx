'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project, BackgroundItem, NewsItem } from '@/types';
import { projects as initialProjects } from '@/data/projects';
import { background as initialBackground } from '@/data/background';
import { news as initialNews } from '@/data/news';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active tab: 'projects' | 'background' | 'news'
  const [activeTab, setActiveTab] = useState<'projects' | 'background' | 'news'>('projects');

  // Data state
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [backgroundList, setBackgroundList] = useState<BackgroundItem[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);

  // Toast / notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Edit / Add Modals
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  const [editingBackground, setEditingBackground] = useState<BackgroundItem | null>(null);
  const [isNewBackground, setIsNewBackground] = useState(false);

  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isNewNews, setIsNewNews] = useState(false);

  // Code Export Modal
  const [exportModal, setExportModal] = useState<{ title: string; code: string; filename: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if session token exists
    const token = localStorage.getItem('jwl_admin_token');
    if (token) {
      setIsAuthenticated(true);
    }

    // Load from localStorage or defaults
    const savedProjects = localStorage.getItem('jwl_cms_projects');
    const savedBackground = localStorage.getItem('jwl_cms_background');
    const savedNews = localStorage.getItem('jwl_cms_news');

    setProjectsList(savedProjects ? JSON.parse(savedProjects) : initialProjects);
    setBackgroundList(savedBackground ? JSON.parse(savedBackground) : initialBackground);
    setNewsList(savedNews ? JSON.parse(savedNews) : initialNews);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Default passcode: admin1234
    if (password === 'admin1234' || password === 'jwl2026') {
      localStorage.setItem('jwl_admin_token', 'session_' + Date.now());
      setIsAuthenticated(true);
      showToast('Welcome back, Admin!');
    } else {
      setLoginError('Invalid passcode. Default passcode is admin1234');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwl_admin_token');
    setIsAuthenticated(false);
    setPassword('');
  };

  // Image Upload handler (Data URL for instant client persistence)
  const handleImageFile = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        callback(e.target.result as string);
        showToast('Image loaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Save changes to localStorage & trigger feedback
  const saveProjects = (newList: Project[]) => {
    setProjectsList(newList);
    localStorage.setItem('jwl_cms_projects', JSON.stringify(newList));
    showToast('Projects updated!');
  };

  const saveBackground = (newList: BackgroundItem[]) => {
    setBackgroundList(newList);
    localStorage.setItem('jwl_cms_background', JSON.stringify(newList));
    showToast('Background updated!');
  };

  const saveNews = (newList: NewsItem[]) => {
    setNewsList(newList);
    localStorage.setItem('jwl_cms_news', JSON.stringify(newList));
    showToast('News updated!');
  };

  const openExportModal = (type: 'projects' | 'background' | 'news') => {
    if (type === 'projects') {
      const code = `import { Project } from '@/types';\nimport projectGalleries from './project-galleries.json';\n\nconst galleries = projectGalleries as Record<string, string[]>;\n\nexport const projects: Project[] = ${JSON.stringify(
        projectsList,
        null,
        2
      )};\n`;
      setExportModal({ title: 'Export Projects Code', code, filename: 'src/data/projects.ts' });
    } else if (type === 'background') {
      const code = `import { BackgroundItem } from '@/types';\n\nexport const background: BackgroundItem[] = ${JSON.stringify(
        backgroundList,
        null,
        2
      )};\n`;
      setExportModal({ title: 'Export Background Code', code, filename: 'src/data/background.ts' });
    } else if (type === 'news') {
      const code = `import { NewsItem } from '@/types';\n\nexport const news: NewsItem[] = ${JSON.stringify(
        newsList,
        null,
        2
      )};\n`;
      setExportModal({ title: 'Export News Code', code, filename: 'src/data/news.ts' });
    }
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200/80">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              ⚙️
            </div>
            <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Admin Login</h1>
            <p className="text-xs text-slate-500 mt-1">Portfolio Content Management System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Passcode
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter passcode (default: admin1234)"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0f172a] text-sm"
                required
                autoFocus
              />
            </div>

            {loginError && <p className="text-xs text-rose-500 font-medium">{loginError}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold rounded-xl text-sm transition-colors shadow-md cursor-pointer"
            >
              Sign In to CMS
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">
              ← Return to Portfolio Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#0f172a]">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">JWL Portfolio CMS</h1>
            <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full font-medium">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-lg transition-colors"
            >
              View Live Website ↗
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'border-[#0f172a] text-[#0f172a]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            📁 Research Projects ({projectsList.length})
          </button>
          <button
            onClick={() => setActiveTab('background')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'background'
                ? 'border-[#0f172a] text-[#0f172a]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            🏛️ Background Timeline ({backgroundList.length})
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'news'
                ? 'border-[#0f172a] text-[#0f172a]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            📢 News ({newsList.length})
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: RESEARCH PROJECTS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#0f172a]">Research Projects</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage projects, venue badges (IEEE T-MRB, IROS, KSME, ICTC), thumbnails, and descriptions.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openExportModal('projects')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  📋 Export Code
                </button>
                <button
                  onClick={() => {
                    setEditingProject({
                      id: `project-${Date.now()}`,
                      title: '',
                      period: '2024 – 2025',
                      category: 'Robotics',
                      venueBadge: '',
                      thumbnail: '/images/projects/cable-driven-bedside/01.png',
                      description: '',
                      keywords: ['Robotics'],
                      links: [],
                    });
                    setIsNewProject(true);
                  }}
                  className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  + Add New Project
                </button>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectsList.map((project, idx) => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="relative w-28 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                        {project.thumbnail && (
                          <Image src={project.thumbnail} alt={project.title} fill className="object-cover" />
                        )}
                        {project.venueBadge && (
                          <span className="absolute top-1 left-1 bg-[#0f172a]/90 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                            {project.venueBadge}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-medium text-slate-400">{project.period}</span>
                        <h3 className="text-sm font-bold text-[#0f172a] leading-snug line-clamp-2 mt-0.5">
                          {project.title}
                        </h3>
                        <span className="inline-block bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-medium mt-1">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{project.description}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setEditingProject({ ...project });
                        setIsNewProject(false);
                      }}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete project "${project.title}"?`)) {
                          const updated = projectsList.filter((_, i) => i !== idx);
                          saveProjects(updated);
                        }
                      }}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: BACKGROUND TIMELINE */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'background' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#0f172a]">Background Timeline & Photos</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage career items, photo sequence (1, 2, 3...), titles, years, and 1-line descriptions.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openExportModal('background')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  📋 Export Code
                </button>
                <button
                  onClick={() => {
                    setEditingBackground({
                      id: `bg-${Date.now()}`,
                      order: backgroundList.length + 1,
                      year: '2024',
                      organization: '',
                      summary: '',
                      logo: '',
                      isMain: false,
                      description: [],
                    });
                    setIsNewBackground(true);
                  }}
                  className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  + Add New Photo / Item
                </button>
              </div>
            </div>

            {/* Background List */}
            <div className="space-y-3">
              {backgroundList.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="w-6 text-center text-xs font-bold text-slate-400 tabular-nums">
                      #{item.order ?? idx + 1}
                    </span>

                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                      {item.logo ? (
                        <Image src={item.logo} alt={item.organization} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                          No Photo
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 tabular-nums">{item.year}</span>
                        {item.isCurrent && (
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                            Current
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-[#0f172a] truncate">{item.organization}</h3>
                      <p className="text-xs text-slate-500 truncate max-w-xl">{item.summary}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingBackground({ ...item });
                        setIsNewBackground(false);
                      }}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete background item "${item.organization}"?`)) {
                          const updated = backgroundList.filter((_, i) => i !== idx);
                          saveBackground(updated);
                        }
                      }}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: NEWS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'news' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#0f172a]">News Updates</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage latest news items and announcements.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openExportModal('news')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  📋 Export Code
                </button>
                <button
                  onClick={() => {
                    setEditingNews({
                      date: 'Jan 2026',
                      description: '',
                      link: '',
                    });
                    setIsNewNews(true);
                  }}
                  className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  + Add News Item
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {newsList.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.date}</span>
                    <p className="text-sm text-[#0f172a] font-medium mt-0.5">{item.description}</p>
                    {item.link && (
                      <span className="text-xs text-[#25527e] font-medium underline mt-1 block truncate max-w-md">
                        {item.link}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingNews({ ...item });
                        setIsNewNews(false);
                      }}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete news item?`)) {
                          const updated = newsList.filter((_, i) => i !== idx);
                          saveNews(updated);
                        }
                      }}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* PROJECT EDIT / ADD MODAL */}
      {/* ------------------------------------------------------------- */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <h2 className="text-lg font-bold text-[#0f172a] mb-4">
              {isNewProject ? 'Add New Project' : 'Edit Project'}
            </h2>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0f172a] focus:outline-none"
                  placeholder="e.g. Gait-Training Robot: Cyclic Disturbance Compensation"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Venue Badge (Paper / Conference)
                  </label>
                  <input
                    type="text"
                    value={editingProject.venueBadge || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, venueBadge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0f172a] focus:outline-none"
                    placeholder="e.g. IEEE T-MRB, IROS, KSME, ICTC"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Leave empty if no paper published</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingProject.category || 'Robotics'}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        category: e.target.value as 'Robotics' | 'Embedded',
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0f172a] focus:outline-none bg-white"
                  >
                    <option value="Robotics">Robotics</option>
                    <option value="Embedded">Embedded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Period</label>
                <input
                  type="text"
                  value={editingProject.period}
                  onChange={(e) => setEditingProject({ ...editingProject, period: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0f172a] focus:outline-none"
                  placeholder="e.g. 2023 – 2025"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Thumbnail Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editingProject.thumbnail}
                    onChange={(e) => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0f172a] focus:outline-none"
                    placeholder="/images/projects/folder/image.png"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageFile(file, (url) => {
                          setEditingProject({ ...editingProject, thumbnail: url, gallery: [url] });
                        });
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Choose Photo
                  </button>
                </div>
              </div>

              {/* Links Section (Paper, GitHub, Video, Custom Links) */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Project Links (Paper, GitHub, Video)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const currentLinks = editingProject.links || [];
                      setEditingProject({
                        ...editingProject,
                        links: [
                          ...currentLinks,
                          { label: 'Paper (IEEE T-MRB)', url: 'https://doi.org/...', type: 'paper' },
                        ],
                      });
                    }}
                    className="text-xs font-semibold text-[#25527e] hover:text-[#1e3a8a] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    + Add Link
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(editingProject.links || []).map((link, linkIdx) => (
                    <div
                      key={linkIdx}
                      className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <select
                        value={link.type || 'paper'}
                        onChange={(e) => {
                          const updatedLinks = [...(editingProject.links || [])];
                          updatedLinks[linkIdx] = {
                            ...link,
                            type: e.target.value as 'paper' | 'github' | 'video' | 'project',
                          };
                          setEditingProject({ ...editingProject, links: updatedLinks });
                        }}
                        className="bg-white border border-slate-300 rounded-lg px-2 py-1.5 font-medium text-slate-700 focus:outline-none"
                      >
                        <option value="paper">📄 Paper</option>
                        <option value="github">💻 GitHub</option>
                        <option value="video">🎥 Video</option>
                        <option value="project">🔗 Demo</option>
                      </select>

                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const updatedLinks = [...(editingProject.links || [])];
                          updatedLinks[linkIdx] = { ...link, label: e.target.value };
                          setEditingProject({ ...editingProject, links: updatedLinks });
                        }}
                        placeholder="Label (e.g. Paper (IROS))"
                        className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
                      />

                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => {
                          const updatedLinks = [...(editingProject.links || [])];
                          updatedLinks[linkIdx] = { ...link, url: e.target.value };
                          setEditingProject({ ...editingProject, links: updatedLinks });
                        }}
                        placeholder="https://..."
                        className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-[11px] focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const updatedLinks = (editingProject.links || []).filter((_, i) => i !== linkIdx);
                          setEditingProject({ ...editingProject, links: updatedLinks });
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 cursor-pointer"
                        title="Remove link"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {(!editingProject.links || editingProject.links.length === 0) && (
                    <p className="text-[11px] text-slate-400 italic py-1">
                      No custom links added yet. Click &ldquo;+ Add Link&rdquo; to add paper or repository links.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0f172a] focus:outline-none"
                  placeholder="Project details, technical achievements..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  let updated = [...projectsList];
                  if (isNewProject) {
                    updated.push(editingProject);
                  } else {
                    updated = updated.map((p) => (p.id === editingProject.id ? editingProject : p));
                  }
                  saveProjects(updated);
                  setEditingProject(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#0f172a] hover:bg-[#1e293b] text-white transition-colors cursor-pointer"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* BACKGROUND EDIT / ADD MODAL */}
      {/* ------------------------------------------------------------- */}
      {editingBackground && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <h2 className="text-lg font-bold text-[#0f172a] mb-4">
              {isNewBackground ? 'Add Background Item' : 'Edit Background Item'}
            </h2>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sequence Order (#)</label>
                  <input
                    type="number"
                    value={editingBackground.order || 1}
                    onChange={(e) =>
                      setEditingBackground({ ...editingBackground, order: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0f172a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Year (displayed large above)</label>
                  <input
                    type="text"
                    value={editingBackground.year || ''}
                    onChange={(e) => setEditingBackground({ ...editingBackground, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0f172a] focus:outline-none"
                    placeholder="e.g. 2021"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title / Organization</label>
                <input
                  type="text"
                  value={editingBackground.organization}
                  onChange={(e) => setEditingBackground({ ...editingBackground, organization: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0f172a] focus:outline-none"
                  placeholder="e.g. Seoul National University of Science and Technology"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">1-Line Summary</label>
                <textarea
                  rows={2}
                  value={editingBackground.summary || ''}
                  onChange={(e) => setEditingBackground({ ...editingBackground, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0f172a] focus:outline-none"
                  placeholder="B.S. in Mechanical System Design Engineering"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Photo Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editingBackground.logo || ''}
                    onChange={(e) => setEditingBackground({ ...editingBackground, logo: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0f172a] focus:outline-none"
                    placeholder="/images/organizations/1.jpg"
                  />
                  <input
                    type="file"
                    ref={bgFileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageFile(file, (url) => {
                          setEditingBackground({ ...editingBackground, logo: url });
                        });
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => bgFileInputRef.current?.click()}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Choose Photo
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setEditingBackground(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  let updated = [...backgroundList];
                  if (isNewBackground) {
                    updated.push(editingBackground);
                  } else {
                    updated = updated.map((b) => (b.id === editingBackground.id ? editingBackground : b));
                  }
                  updated.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                  saveBackground(updated);
                  setEditingBackground(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#0f172a] hover:bg-[#1e293b] text-white transition-colors cursor-pointer"
              >
                Save Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* NEWS EDIT / ADD MODAL */}
      {/* ------------------------------------------------------------- */}
      {editingNews && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-[#0f172a] mb-4">
              {isNewNews ? 'Add News Item' : 'Edit News Item'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="text"
                  value={editingNews.date}
                  onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0f172a] focus:outline-none"
                  placeholder="e.g. Jan 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingNews.description}
                  onChange={(e) => setEditingNews({ ...editingNews, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0f172a] focus:outline-none"
                  placeholder="e.g. Paper accepted to IEEE T-MRB..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Link (Optional)</label>
                <input
                  type="text"
                  value={editingNews.link || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, link: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0f172a] focus:outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setEditingNews(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  let updated = [...newsList];
                  if (isNewNews) {
                    updated.unshift(editingNews);
                  } else {
                    const editIdx = newsList.findIndex((n) => n === editingNews);
                    if (editIdx >= 0) updated[editIdx] = editingNews;
                  }
                  saveNews(updated);
                  setEditingNews(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#0f172a] hover:bg-[#1e293b] text-white transition-colors cursor-pointer"
              >
                Save News
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* EXPORT CODE MODAL */}
      {/* ------------------------------------------------------------- */}
      {exportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-[#0f172a]">{exportModal.title}</h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{exportModal.filename}</p>
              </div>
              <button
                onClick={() => setExportModal(null)}
                className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Copy this updated code and paste it into <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">{exportModal.filename}</code> to permanently keep your changes in Git!
            </p>

            <pre className="bg-slate-900 text-slate-100 p-4 rounded-2xl text-xs font-mono max-h-[50vh] overflow-auto select-all leading-relaxed">
              {exportModal.code}
            </pre>

            <div className="flex justify-end gap-2.5 mt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(exportModal.code);
                  showToast('Code copied to clipboard!');
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#0f172a] hover:bg-[#1e293b] text-white transition-colors shadow-sm cursor-pointer"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
