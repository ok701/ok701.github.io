interface ProjectFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function ProjectFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeCategory === category
              ? 'bg-[#0f172a] text-white shadow-[0_2px_8px_rgba(15,23,42,0.15)]'
              : 'text-slate-500 bg-white/90 border border-slate-200 hover:text-slate-900 hover:bg-white hover:border-slate-300'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
