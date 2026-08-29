'use client';

import { useEffect, useState } from 'react';
import { news } from '@/data/news';
import { NewsItem as NewsItemType } from '@/types';
import NewsItem from './NewsItem';

function normalizeNewsItems(items: NewsItemType[]) {
  return items.map((item) => {
    const isTmrbPaper = item.link?.includes('TMRB.2026.3722280');
    const hasJcrBadge = item.description.includes('(JCR Q2)');

    if (!isTmrbPaper || hasJcrBadge) {
      return item;
    }

    return {
      ...item,
      description: item.description.replace(
        'IEEE Transactions on Medical Robotics and Bionics',
        'IEEE Transactions on Medical Robotics and Bionics (JCR Q2)'
      ),
    };
  });
}

export default function News() {
  const [newsList] = useState<NewsItemType[]>(() => {
    if (typeof window === 'undefined') {
      return news;
    }

    const saved = localStorage.getItem('jwl_cms_news');
    if (saved) {
      try {
        return normalizeNewsItems(JSON.parse(saved));
      } catch {
        // fallback
      }
    }

    return news;
  });

  useEffect(() => {
    localStorage.setItem('jwl_cms_news', JSON.stringify(newsList));
  }, [newsList]);

  return (
    <section id="news" className="py-8 px-6">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="text-[28px] font-light text-[#0f172a] mb-3">News</h2>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] p-6 md:p-8">
          <ul className="space-y-4">
            {newsList.map((item, index) => (
              <NewsItem key={index} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
