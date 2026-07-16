const cuisines = [
    { name: 'North Indian', emoji: '🍛' },
    { name: 'Italian', emoji: '🍝' },
    { name: 'Chinese', emoji: '🥢' },
    { name: 'South Indian', emoji: '🥥' },
    { name: 'American', emoji: '🍔' },
  ];
  
  export default function CuisineExplore({ onSelect }) {
    return (
      <section id="explore" className="cuisine-section">
        <h2>Explore by cuisine</h2>
        <div className="cuisine-grid">
          {cuisines.map((c) => (
            <button key={c.name} className="cuisine-card" onClick={() => onSelect(c.name)}>
              <span className="cuisine-emoji">{c.emoji}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </section>
    );
  }