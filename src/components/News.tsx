import { news } from '@/data/news';
import NewsItem from './NewsItem';

export default function News() {
  return (
    <section id="news" className="py-8 px-6">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="text-[28px] font-light text-[#0f172a] mb-3">News</h2>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] p-6 md:p-8">
          <ul className="space-y-4">
            {news.map((item, index) => (
              <NewsItem key={index} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
