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


  // const cuisines = [
  //   { name: 'North Indian', emoji: '🍛' },
  //   { name: 'South Indian', emoji: '🥥' },
  //   { name: 'Maharashtrian', emoji: '🍲' },
  //   { name: 'Punjabi', emoji: '🧈' },
  //   { name: 'Gujarati', emoji: '🥘' },
  //   { name: 'Bengali', emoji: '🐟' },
  //   { name: 'Hyderabadi', emoji: '🍗' },
  //   { name: 'Goan', emoji: '🦐' },
  //   { name: 'Malvani', emoji: '🦀' },
  //   { name: 'Mughlai', emoji: '🍖' },
  
  //   { name: 'Chinese', emoji: '🥢' },
  //   { name: 'Italian', emoji: '🍝' },
  //   { name: 'American', emoji: '🍔' },
  //   { name: 'Mexican', emoji: '🌮' },
  //   { name: 'Thai', emoji: '🍜' },
  //   { name: 'Japanese', emoji: '🍣' },
  //   { name: 'Korean', emoji: '🍲' },
  //   { name: 'Mediterranean', emoji: '🫒' },
  //   { name: 'Lebanese', emoji: '🥙' },
  
  //   { name: 'Pizza', emoji: '🍕' },
  //   { name: 'Biryani', emoji: '🍚' },
  //   { name: 'Fast Food', emoji: '🍟' },
  //   { name: 'Burgers', emoji: '🍔' },
  //   { name: 'Sandwiches', emoji: '🥪' },
  //   { name: 'Rolls', emoji: '🌯' },
  //   { name: 'Momos', emoji: '🥟' },
  //   { name: 'Seafood', emoji: '🦞' },
  //   { name: 'BBQ', emoji: '🔥' },
  //   { name: 'Kebab', emoji: '🍢' },
  //   { name: 'Street Food', emoji: '🌭' },
  
  //   { name: 'Cafe', emoji: '☕' },
  //   { name: 'Bakery', emoji: '🥐' },
  //   { name: 'Desserts', emoji: '🍰' },
  //   { name: 'Ice Cream', emoji: '🍨' },
  //   { name: 'Healthy Food', emoji: '🥗' },
  //   { name: 'Beverages', emoji: '🥤' },
  // ];
  
  
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