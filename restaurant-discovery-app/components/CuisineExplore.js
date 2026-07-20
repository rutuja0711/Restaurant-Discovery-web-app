const cuisines = [
  { name: 'North Indian', emoji: '🍛' },
  { name: 'Italian', emoji: '🍝' },
  { name: 'Chinese', emoji: '🥢' },
  { name: 'American', emoji: '🍔' },
  { name: 'South Indian', emoji: '🥥' },
  { name: 'Maharashtrian', emoji: '🍲' },
  { name: 'Punjabi', emoji: '🧈' },
  { name: 'Gujarati', emoji: '🥘' },
];

export default function CuisineExplore({ onSelect }) {
  return (
    <section id="explore" className="py-12 pb-6">
      <h2 className="mb-6 text-center">Explore by cuisine</h2>
      <div className="flex flex-wrap justify-center gap-3.5">
        {cuisines.map((c) => (
          <button
            key={c.name}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-[18px] border-none bg-white px-7 py-[22px] font-medium text-forest-dark shadow-card-sm transition hover:-translate-y-[5px] hover:shadow-card-md"
            onClick={() => onSelect(c.name)}
          >
            <span className="text-[1.8rem]">{c.emoji}</span>
            <span>{c.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
