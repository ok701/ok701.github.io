import { NewsItem as NewsItemType } from '@/types';

interface NewsItemProps {
  item: NewsItemType;
}

export default function NewsItem({ item }: NewsItemProps) {
  const content = item.link ? (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-700 hover:text-[#25527e] transition-colors underline-offset-2 hover:underline font-medium"
    >
      {item.description}
    </a>
  ) : (
    item.description
  );

  return (
    <li className="text-slate-600">
      <div className="flex items-start gap-4">
        <div className="text-sm font-medium text-slate-400 flex-shrink-0 min-w-[80px] tabular-nums">
          {item.date}
        </div>
        <div className="flex-1 text-sm leading-relaxed">{content}</div>
      </div>
    </li>
  );
}
