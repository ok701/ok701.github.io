import Image from 'next/image';
import { profile } from '@/data/profile';
import SocialLinks from './SocialLinks';

export default function Profile() {
  const profileTextColor = 'text-[#0f172a]';

  return (
    <section id="profile" className="pt-24 pb-8 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Profile Photo */}
          <div className="w-48 h-48 md:w-56 md:h-56 relative rounded-full overflow-hidden border-4 border-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] flex-shrink-0">
            <Image
              src={profile.profileImage}
              alt={profile.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className={`text-3xl md:text-4xl font-extrabold ${profileTextColor} mb-2 tracking-tight`}>
              {profile.name}
            </h1>
            <p className={`${profileTextColor} text-base md:text-lg font-medium mb-4 opacity-85`}>
              {profile.subtitle}
            </p>

            {profile.bio.map((paragraph, i) => (
              <p
                key={i}
                className={`${profileTextColor} text-base leading-relaxed mb-3 last:mb-0 opacity-90`}
              >
                {paragraph}
              </p>
            ))}

            {/* Research Interests */}
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
              {profile.researchInterests.map((interest) => (
                <span
                  key={interest}
                  className="text-xs bg-[#f3eadc] text-[#4a2d1f] px-2.5 py-1 rounded-full font-semibold border border-[#e2cfb7]"
                >
                  {interest}
                </span>
              ))}
            </div>

            {/* Social Links */}
            <div className="mt-5 flex justify-center md:justify-start">
              <SocialLinks links={profile.socialLinks} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
