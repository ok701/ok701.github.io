import { Profile } from '@/types';
import profileData from './profile-image.json';

export const profile: Profile = {
  name: 'Jin-Woo Lee',
  subtitle: 'Robotic Control Engineer',
  bio: [
    'I’m Jin-Woo Lee, an engineer and researcher fascinated by how robots move.',
    'From currents in circuits to forces in motion and intelligence in algorithms, I explore what brings robots to life.'
  ],
  researchInterests: [
    'Robot Control',
    'Dynamics',
    'Motors',
    'Human–Robot Interaction',
  ],
  socialLinks: [
    {
      label: 'Email',
      url: 'mailto:realfcn@gmail.com',
      icon: 'email',
    },
    {
      label: 'CV',
      url: '/CV.pdf',
      icon: 'cv',
    },
    {
      label: 'GitHub',
      url: 'https://github.com/ok701',
      icon: 'github',
    },
    {
      label: 'Google Scholar',
      // TODO: Replace with your actual Google Scholar URL
      url: 'https://scholar.google.com/citations?user=YOUR_SCHOLAR_ID',
      icon: 'scholar',
    },
  ],
  profileImage: profileData.profileImage || '/images/profile/profile.jpg',
};
