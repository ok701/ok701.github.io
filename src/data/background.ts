import { BackgroundItem } from '@/types';
import orgLogos from './organization-logos.json';

const logos = orgLogos as Record<string, string>;

export const background: BackgroundItem[] = [
  {
    id: 'seoultech',
    organization: 'HRR Lab, SeoulTech',
    role: 'Researcher',
    period: '2021 — 2022',
    year: '2021',
    location: 'Seoul, South Korea',
    summary:
      'Received B.S. in Mechanical System Design Engineering, advised by Prof. Jung-Yup Kim. Designed and built a lightweight 6-DoF manipulator with 3D-printed links and QDD actuators, developing whole-body task-space torque control and Center-of-Mass stabilization algorithms for mobile manipulation and VR teleoperation.',
    description: [
      'B.S. in Mechanical System Design Engineering, advised by Prof. Jung-Yup Kim.',
      'Designed and built a lightweight 6-DoF manipulator using quasi-direct-drive actuators for mobile manipulation.',
      'Developed ROS-based control system for simulation validation and real-hardware implementation.',
    ],
    logo: logos['seoultech'] || '/images/organizations/seoultech.jpg',
  },
  {
    id: 'gist',
    organization: 'AWEAR Lab, GIST',
    role: 'Graduate Researcher',
    period: '2023 — 2025',
    year: '2023',
    location: 'Gwangju, South Korea',
    summary:
      'Completed M.S. in AI Convergence (Intelligent Robotics) under the supervision of Prof. Jiyeon Kang. Developed an upper-limb cable-driven rehabilitation robot with real-time force sensing and constrained tension allocation, and conducted human-subject experiments validating adaptive impedance control for assist-as-needed bedside training.',
    description: [
      'M.S. in AI Convergence (Intelligent Robotics), advised by Prof. Jiyeon Kang.',
      'Developed cable-driven robotic platform for upper-limb rehabilitation with real-time force sensing and compliant control.',
      'Conducted human-subject experiments validating adaptive impedance control for assist–resist rehabilitation.',
    ],
    logo: logos['gist'] || '/images/organizations/gist.jpg',
  },
  {
    id: 'samsung',
    organization: 'Samsung Electronics',
    role: 'Motor Control Engineer',
    period: '2025 — Present',
    year: '2025',
    location: 'Suwon, South Korea',
    isCurrent: true,
    summary:
      'Working on PMSM drive systems at Samsung Electronics, focusing on three-phase inverter hardware design, switching behavior analysis, and dynamometer-based motor testing. Developed automated lookup-table (LUT) generation tools for MTPA, field-weakening, and MTPV control strategies to enhance operational efficiency and dynamic drive performance.',
    description: [
      'Design and hardware debugging of three-phase inverters for PMSM drives, including switching behavior analysis, fault diagnosis, and dynamometer-based motor testing.',
      'Developed automated LUT generation tool for MTPA, field-weakening, and MTPV control of PMSM/IPMSM drives.',
    ],
    logo: logos['samsung'] || '/images/organizations/samsung.png',
  },
];
