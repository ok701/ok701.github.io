import { BackgroundItem } from '@/types';
import backgroundThumbnails from './background-thumbnails.json';

const thumbnails = backgroundThumbnails as Record<string, string>;

const thumbnailFor = (logo: string) => thumbnails[logo] || logo;

export const normalizeBackgroundImages = (item: BackgroundItem): BackgroundItem => {
  if (!item.logo) {
    return item;
  }

  return {
    ...item,
    thumbnail: thumbnailFor(item.logo),
  };
};

export const background: BackgroundItem[] = [
  {
    id: 'bg-1',
    order: 1,
    year: '2019',
    organization: 'Korean Augmentation to the U.S. Army',
    summary: 'Senior KATUSA, platoon leadership and U.S.–Korean military liaison.',
    logo: '/images/organizations/1.jpg',
    thumbnail: thumbnailFor('/images/organizations/1.jpg'),
  },
  {
    id: 'bg-2',
    order: 2,
    year: '2021',
    organization: 'Seoul National University of Science and Technology',
    summary: 'B.S. in Mechanical System Design Engineering',
    logo: '/images/organizations/2_main.jpg',
    thumbnail: thumbnailFor('/images/organizations/2_main.jpg'),
  },
  {
    id: 'bg-3',
    order: 3,
    year: '2021',
    organization: 'Super Local Project',
    summary: 'Encouragement Award',
    logo: '/images/organizations/3.JPG',
    thumbnail: thumbnailFor('/images/organizations/3.JPG'),
  },
  {
    id: 'bg-4',
    order: 4,
    year: '2022',
    organization: 'Korea Police World Expo',
    summary: 'Presented a robotic manipulator designed and developed by our team.',
    logo: '/images/organizations/4.PNG',
    thumbnail: thumbnailFor('/images/organizations/4.PNG'),
  },
  {
    id: 'bg-5',
    order: 5,
    year: '2023',
    organization: 'H-Mobility Robotics Hackathon',
    summary: 'Competed as a selected participant in a two-day robotics hackathon.',
    logo: '/images/organizations/5.JPG',
    thumbnail: thumbnailFor('/images/organizations/5.JPG'),
  },
  {
    id: 'bg-6',
    order: 6,
    year: '2023',
    organization: 'Gwangju Institute of Science and Technology',
    summary:
      'M.S. in AI Convergence (Intelligent Robotics) — GIST was ranked 6th globally in Citations per Faculty, QS World University Rankings 2023.',
    logo: '/images/organizations/6_main.jpg',
    thumbnail: thumbnailFor('/images/organizations/6_main.jpg'),
  },
  {
    id: 'bg-7',
    order: 7,
    year: '2025',
    isCurrent: true,
    organization: 'Samsung Electronics',
    summary: 'Motor Control Engineer, developing three-phase inverter hardware.',
    logo: '/images/organizations/7_main.jpg',
    thumbnail: thumbnailFor('/images/organizations/7_main.jpg'),
  },
  {
    id: 'bg-8',
    order: 8,
    year: '2026',
    organization: 'Super Rookie Project',
    summary: 'Final-round presenter, ranked in the top 10% of 300+ participants.',
    logo: '/images/organizations/8.JPG',
    thumbnail: thumbnailFor('/images/organizations/8.JPG'),
  },
];
