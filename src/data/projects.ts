import { Project } from '@/types';
import projectGalleries from './project-galleries.json';

const galleries = projectGalleries as Record<string, string[]>;

export const projects: Project[] = [
  {
    id: 'gait-training-robot',
    title: 'Gait-Training Robot: Cyclic Disturbance Compensation',
    galleryFolder: 'disturbance-compensation',
    thumbnail: galleries['disturbance-compensation']?.[0] || '/images/projects/disturbance-compensation/01.svg',
    gallery: galleries['disturbance-compensation'] || ['/images/projects/disturbance-compensation/01.svg'],
    description:
      'Developed an enhanced feedforward force controller designed to compensate for repetitive cyclic disturbances during robot-assisted walking. By coupling human biomechanics modeling with periodic disturbance estimation, the controller achieves precise trajectory force tracking and compliant interaction over gait cycles.',
    keywords: ['Force Control', 'Gait Training', 'Disturbance Compensation', 'Rehabilitation'],
    category: 'Robotics',
    venueBadge: 'IEEE T-MRB',
    period: '2023 – 2025',
    paperUrl: 'https://doi.org/10.1109/TMRB.2026.3722280',
    links: [
      {
        label: 'Paper (IEEE T-MRB)',
        url: 'https://doi.org/10.1109/TMRB.2026.3722280',
        type: 'paper',
      },
    ],
  },
  {
    id: 'cable-driven-robot',
    title: 'Cable-Driven Bedside Training Robot',
    galleryFolder: 'cable-driven-bedside',
    thumbnail: galleries['cable-driven-bedside']?.[0] || '/images/projects/cable-driven-bedside/01.png',
    gallery: galleries['cable-driven-bedside'] || ['/images/projects/cable-driven-bedside/01.png'],
    description:
      'Developed an upper-limb cable-driven robotic platform for bedside rehabilitation. Formulated real-time constrained optimization for cable tension allocation to maintain feasible force bounds, and implemented an adaptive impedance controller with online stiffness and damping adaptation to deliver assist-as-needed robotic training tailored to user effort.',
    keywords: ['Impedance Control', 'Cable-Driven', 'Optimization', 'Rehabilitation'],
    category: 'Robotics',
    venueBadge: 'IROS',
    period: '2023 – 2025',
    paperUrl: '#',
    links: [
      {
        label: 'Paper (IROS)',
        url: '#',
        type: 'paper',
      },
    ],
  },
  {
    id: 'mobile-manipulator',
    title: '6-DoF Mobile Manipulator: CoM & Task-Space Control',
    galleryFolder: 'mobile-manipulator',
    thumbnail: galleries['mobile-manipulator']?.[0] || '/images/projects/mobile-manipulator/01.svg',
    gallery: galleries['mobile-manipulator'] || ['/images/projects/mobile-manipulator/01.svg'],
    description:
      'Designed and built a custom lightweight 6-DoF manipulator with 3D-printed mechanical links and Quasi-Direct Drive (QDD) actuators for agile mobile manipulation. Formulated analytical kinematics and mass-weighted Jacobians to implement task-space torque control with gravity compensation and joint compliance.\n\nTo ensure whole-body balance during mobile operation, developed an active Center-of-Mass (CoM) stabilization controller and integrated the arm onto mobile and quadruped platforms, validating the complete system across ROS/Gazebo simulations and real-hardware VR teleoperation experiments.',
    keywords: ['Task-Space Control', 'CoM Control', 'QDD Actuators', 'ROS'],
    category: 'Robotics',
    venueBadge: 'KSME / KMSM',
    period: '2021 – 2022',
    links: [
      {
        label: 'GitHub — Robot System / ROS',
        url: 'https://github.com/ok701/st-arm-ros',
        type: 'github',
      },
      {
        label: 'GitHub — Control Algorithms',
        url: 'https://github.com/ok701/manipulator-algorithms',
        type: 'github',
      },
      {
        label: 'Paper (KSME 2022)',
        url: '#',
        type: 'paper',
      },
    ],
  },
  {
    id: 'motor-control',
    title: 'PMSM Motor Control & Inverter Design',
    galleryFolder: 'motor-control',
    thumbnail: galleries['motor-control']?.[0] || '/images/projects/motor-control/01.svg',
    gallery: galleries['motor-control'] || ['/images/projects/motor-control/01.svg'],
    description:
      'Contributing to the design and hardware debugging of a three-phase inverter for PMSM drives, including switching behavior analysis, fault diagnosis, and dynamometer-based motor testing. Developed an automated lookup-table (LUT) generation tool for MTPA, field-weakening, and MTPV control strategies.',
    keywords: ['PMSM', 'Motor Control', 'Inverter Design', 'MTPA'],
    category: 'Embedded',
    period: '2025 – Present',
  },
  {
    id: 'embedded-control',
    title: 'Embedded Control Systems',
    galleryFolder: 'embedded-control',
    thumbnail: galleries['embedded-control']?.[0] || '/images/projects/embedded-control/01.svg',
    gallery: galleries['embedded-control'] || ['/images/projects/embedded-control/01.svg'],
    description:
      'Developed embedded systems architectures for real-time robot control and sensor integration. Built low-latency communication pipelines and firmware modules to bridge high-level trajectory generation with low-level actuator drives in hardware.',
    keywords: ['Embedded Systems', 'Real-Time Control', 'Firmware', 'Sensors'],
    category: 'Embedded',
    period: '2021 – Present',
  },
];
