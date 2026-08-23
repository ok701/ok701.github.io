# Jin-Woo Lee — Personal Portfolio

A clean, academic-style personal portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build & Export

```bash
npm run build
```

This generates a static export in the `out/` directory, ready for GitHub Pages.

## Deployment (GitHub Pages)

1. Push this repository to GitHub as `<YOUR_USERNAME>.github.io`
2. Go to **Settings → Pages → Source** and select **GitHub Actions**
3. The included `.github/workflows/deploy.yml` will automatically build and deploy on every push to `main`

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles & custom scrollbars
│   ├── layout.tsx           # Root layout with metadata & fonts
│   └── page.tsx             # Main single-page homepage
├── components/
│   ├── Navbar.tsx            # Top navigation bar with Bodoni Moda wordmark
│   ├── Profile.tsx           # Profile/hero section
│   ├── SocialLinks.tsx       # Social link pill buttons
│   ├── News.tsx              # News section
│   ├── NewsItem.tsx          # Individual news entry
│   ├── ResearchProjects.tsx  # Research projects with category filtering
│   ├── ProjectFilter.tsx     # Robotics / Embedded category filter buttons
│   ├── ProjectCard.tsx       # 2-Column compact project cards
│   ├── ProjectDetailModal.tsx# High-focus modal with smooth animations
│   ├── ProjectGallery.tsx    # Draggable & touch-swipeable image carousel
│   ├── Background.tsx        # Background/experience timeline section
│   ├── BackgroundItem.tsx    # Individual background entry
│   └── Footer.tsx            # Minimal footer
├── data/                     # ← EDIT THESE TO UPDATE CONTENT
│   ├── profile.ts            # Name, bio, social links
│   ├── news.ts               # News entries
│   ├── projects.ts           # Research projects config
│   ├── background.ts         # Experience/education
│   └── project-galleries.json# (Auto-generated) Project images manifest
└── types/
    └── index.ts              # TypeScript interfaces

public/
├── CV.pdf                    # Your CV (downloadable)
└── images/
    ├── profile/
    │   └── profile.jpg       # ← REPLACE with your photo
    ├── projects/             # ← PROJECT GALLERY IMAGES
    │   ├── cable-driven-bedside/
    │   │   ├── 01.jpg        # (Thumbnail & 1st gallery slide)
    │   │   └── 02.png        # (2nd gallery slide)
    │   ├── mobile-manipulator/
    │   │   └── 01.svg
    │   ├── disturbance-compensation/
    │   │   └── 01.svg
    │   ├── motor-control/
    │   └── embedded-control/
    └── organizations/        # Organization logos (Samsung, GIST, SeoulTech)
```

## How to Update Content

### Personal Info & Links
Edit `src/data/profile.ts`:
- Name, subtitle, bio paragraphs
- Research interests
- Social links (Email, CV, GitHub, Google Scholar)

### Profile Photo
Replace `public/images/profile/profile.jpg` with your actual photo (1:1 square JPG/WebP recommended).

### Project Photos & Multi-Image Gallery
Each project has its dedicated folder under **`public/images/projects/`**:
- **Cable-Driven Robot**: `public/images/projects/cable-driven-bedside/`
- **6-DoF Manipulator**: `public/images/projects/mobile-manipulator/`
- **Gait Robot**: `public/images/projects/disturbance-compensation/`
- **PMSM Motor Control**: `public/images/projects/motor-control/`
- **Embedded Systems**: `public/images/projects/embedded-control/`

**Rules & Features:**
- Just drop your image files (`01.jpg`, `02.png`, `03.webp`, etc.) into the respective project folder.
- **No code modification needed**: The background sync system automatically indexes all images in numerical order.
- The first image (`01.*`) is automatically used as the outer compact card thumbnail.
- In the detail modal, multiple images become an interactive, draggable & swipeable carousel.

### Projects Data & Text
Edit `src/data/projects.ts`:
- Each project has `title`, `description`, `keywords`, `category`, `period`
- `links`: Array of custom links (GitHub, Paper, Video, Project URL)
- `category` must be `'Robotics'` or `'Embedded'`

### News
Edit `src/data/news.ts`:
- Add/remove news entries with `date`, `description`, and optional `link`
- Entries are displayed in the order they appear in the array (newest first)

### Background / Experience
Edit `src/data/background.ts`:
- Organization, role, period, location, description bullets
- Optional logo path

### CV
Replace `public/CV.pdf` with your updated CV.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, Static Export)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Google Fonts](https://fonts.google.com/) (Inter, Bodoni Moda)
