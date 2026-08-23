import Navbar from '@/components/Navbar';
import Profile from '@/components/Profile';
import News from '@/components/News';
import ResearchProjects from '@/components/ResearchProjects';
import Background from '@/components/Background';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <main>
        <Profile />
        <News />
        <ResearchProjects />
        <Background />
      </main>
      <Footer />
    </div>
  );
}
