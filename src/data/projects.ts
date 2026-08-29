import { Project } from '@/types';
import projectGalleries from './project-galleries.json';
import projectThumbnails from './project-thumbnails.json';

const galleries = projectGalleries as Record<string, string[]>;
const thumbnails = projectThumbnails as Record<string, string>;

const galleryFor = (folder: string, fallback: string[]) =>
  galleries[folder]?.length ? galleries[folder] : fallback;

const thumbnailFor = (folder: string, fallback: string) =>
  thumbnails[folder] || galleryFor(folder, [fallback])[0];

const fallbackProjectImage = '/images/projects/motor-control/01.svg';

const isEmbeddedImage = (src?: string) => src?.startsWith('data:image');
const removedDefaultProjectIds = new Set(['embedded-control']);

const categoryFor = (project: Project) => {
  if (project.id === 'motor-control' && project.category === 'Embedded') {
    return 'Motor Control';
  }

  if (
    project.id === 'motor-fault-classifier' &&
    project.category !== 'AI'
  ) {
    return 'AI';
  }

  return project.category;
};

export const normalizeProjectImages = (project: Project): Project => {
  const galleryFolder =
    project.galleryFolder ||
    projects.find((defaultProject) => defaultProject.id === project.id)
      ?.galleryFolder ||
    (galleries[project.id]?.length ? project.id : undefined);

  if (!galleryFolder || !galleries[galleryFolder]?.length) {
    const thumbnail = isEmbeddedImage(project.thumbnail)
      ? fallbackProjectImage
      : project.thumbnail;
    const gallery = project.gallery?.filter((src) => !isEmbeddedImage(src));

    return {
      ...project,
      category: categoryFor(project),
      thumbnail,
      gallery: gallery?.length ? gallery : [thumbnail],
    };
  }

  const gallery = galleries[galleryFolder];

  return {
    ...project,
    category: categoryFor(project),
    galleryFolder,
    thumbnail: thumbnailFor(galleryFolder, gallery[0]),
    gallery,
  };
};

export const projects: Project[] = [
  {
    id: 'cable-driven-robot',
    title: 'Cable-Driven Bedside Training Robot',
    galleryFolder: 'cable-driven-bedside',
    thumbnail: thumbnailFor(
      'cable-driven-bedside',
      '/images/projects/cable-driven-bedside/01.png'
    ),
    gallery: galleryFor('cable-driven-bedside', [
      '/images/projects/cable-driven-bedside/01.png',
    ]),
    description:
      'Developed an upper-limb cable-driven robotic platform for bedside rehabilitation. Formulated real-time constrained optimization for cable tension allocation to maintain feasible force bounds, and implemented an adaptive impedance controller with online stiffness and damping adaptation to deliver assist-as-needed robotic training tailored to user effort.',
    keywords: [
      'Impedance Control',
      'Cable-Driven',
      'Optimization',
      'Rehabilitation',
    ],
    category: 'Robotics',
    venueBadge: 'IROS',
    period: '2023 – 2025',
    paperUrl: '#',
    links: [
      {
        label: 'IROS',
        url: '#',
        type: 'paper',
      },
    ],
  },
  {
    id: 'mobile-manipulator',
    title: '6-DoF Mobile Manipulator: CoM & Task-Space Control',
    galleryFolder: 'mobile-manipulator',
    thumbnail: thumbnailFor(
      'mobile-manipulator',
      '/images/projects/mobile-manipulator/01.png'
    ),
    gallery: galleryFor('mobile-manipulator', [
      '/images/projects/mobile-manipulator/01.png',
    ]),
    description:
      'Designed and built a custom lightweight 6-DoF manipulator with 3D-printed mechanical links and Quasi-Direct Drive (QDD) actuators for agile mobile manipulation. Formulated analytical kinematics and mass-weighted Jacobians to implement task-space torque control with gravity compensation and joint compliance.\n\nTo ensure whole-body balance during mobile operation, developed an active Center-of-Mass (CoM) stabilization controller and integrated the arm onto mobile and quadruped platforms, validating the complete system across ROS/Gazebo simulations and real-hardware VR teleoperation experiments.',
    keywords: ['Task-Space Control', 'CoM Control', 'QDD Actuators', 'ROS'],
    category: 'Robotics',
    venueBadge: 'KSME',
    period: '2021 – 2022',
    links: [
      {
        label: 'ROS Simulation',
        url: 'https://github.com/ok701/st-arm-ros',
        type: 'github',
      },
      {
        label: 'Algorithm',
        url: 'https://github.com/ok701/manipulator-algorithms',
        type: 'github',
      },
      {
        label: 'KSME 2022',
        url: 'https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11182130',
        type: 'paper',
      },
    ],
  },
  {
    id: 'gait-training-robot',
    title: 'Gait-Training Robot: Cyclic Disturbance Compensation',
    galleryFolder: 'disturbance-compensation',
    thumbnail: thumbnailFor(
      'disturbance-compensation',
      '/images/projects/disturbance-compensation/01.png'
    ),
    gallery: galleryFor('disturbance-compensation', [
      '/images/projects/disturbance-compensation/01.png',
    ]),
    description:
      'Developed an enhanced feedforward force controller designed to compensate for repetitive cyclic disturbances during robot-assisted walking. By coupling human biomechanics modeling with periodic disturbance estimation, the controller achieves precise trajectory force tracking and compliant interaction over gait cycles.',
    keywords: [
      'Force Control',
      'Gait Training',
      'Disturbance Compensation',
      'Rehabilitation',
    ],
    category: 'Robotics',
    venueBadge: 'IEEE T-MRB',
    period: '2023 – 2025',
    paperUrl: 'https://doi.org/10.1109/TMRB.2026.3722280',
    links: [
      {
        label: 'IEEE T-MRB',
        url: 'https://doi.org/10.1109/TMRB.2026.3722280',
        type: 'paper',
      },
    ],
  },
  {
    id: 'motor-control',
    title: 'PMSM Motor Control & Inverter Design',
    galleryFolder: 'motor-control',
    thumbnail: thumbnailFor('motor-control', '/images/projects/motor-control/01.svg'),
    gallery: galleryFor('motor-control', ['/images/projects/motor-control/01.svg']),
    description:
      'Contributing to the design and hardware debugging of a three-phase inverter for PMSM drives, including switching behavior analysis, fault diagnosis, and dynamometer-based motor testing. Developed an automated lookup-table (LUT) generation tool for MTPA, field-weakening, and MTPV control strategies.',
    keywords: ['PMSM', 'Motor Control', 'Inverter Design', 'MTPA'],
    category: 'Motor Control',
    period: '2025 – Present',
  },
  {
    id: 'motor-fault-classifier',
    title: 'EV Motor Fault Classification with CNN-LSTM',
    galleryFolder: 'motor-fault',
    thumbnail: thumbnailFor('motor-fault', '/images/projects/motor-fault/01.png'),
    gallery: galleryFor('motor-fault', ['/images/projects/motor-fault/01.png']),
    description:
      'Developed a deep learning-based fault diagnosis model for electric vehicle operation data, focusing on motor fault classification from three-phase current signals. Built a CNN-LSTM architecture to identify normal operation, bearing faults, rotor imbalance, shaft misalignment, and loose belt conditions, and validated the model in a physical demonstration setup for practical EV diagnostics.',
    keywords: [
      'Motor Fault Diagnosis',
      'CNN-LSTM',
      'Electric Vehicles',
      'Deep Learning',
    ],
    category: 'AI',
    venueBadge: 'ICTC',
    period: '2025',
    paperUrl: 'https://ieeexplore.ieee.org/abstract/document/11388029',
    githubUrl: 'https://github.com/ok701/motor-fault-classifier',
    links: [
      {
        label: 'Code',
        url: 'https://github.com/ok701/motor-fault-classifier',
        type: 'github',
      },
      {
        label: 'ICTC 2025',
        url: 'https://ieeexplore.ieee.org/abstract/document/11388029',
        type: 'paper',
      },
    ],
  },
];

export function mergeProjectsWithDefaults(savedProjects: Project[]): Project[] {
  const savedProjectIds = new Set(savedProjects.map((project) => project.id));

  return [
    ...savedProjects
      .filter((project) => !removedDefaultProjectIds.has(project.id))
      .map(normalizeProjectImages),
    ...projects.filter((project) => !savedProjectIds.has(project.id)),
  ];
}
