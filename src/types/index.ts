export interface SocialLink {
  label: string;
  url: string;
  icon: 'email' | 'github' | 'scholar' | 'cv' | 'linkedin';
}

export interface Profile {
  name: string;
  subtitle: string;
  bio: string[];
  researchInterests: string[];
  socialLinks: SocialLink[];
  profileImage: string;
}

export interface NewsItem {
  date: string;
  description: string;
  link?: string;
}

export interface ProjectLink {
  label: string;
  url: string;
  type?: 'github' | 'paper' | 'video' | 'project';
}

export interface Project {
  id: string;
  title: string;
  thumbnail: string;
  galleryFolder?: string;
  gallery?: string[];
  description: string;
  keywords: string[];
  category: 'Robotics' | 'Embedded';
  period: string;
  githubUrl?: string;
  paperUrl?: string;
  videoUrl?: string;
  projectUrl?: string;
  links?: ProjectLink[];
}

export interface BackgroundItem {
  id: string;
  order?: number;
  isMain?: boolean;
  organization: string;
  role?: string;
  period?: string;
  year?: string;
  location?: string;
  summary?: string;
  description?: string[];
  logo?: string;
  isCurrent?: boolean;
}
