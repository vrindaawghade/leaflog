import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const features = [
  ["💧 Watering reminders", "See at a glance which plants are thirsty today."],
  ["📖 Care history", "Every watering is logged, so nothing gets forgotten."],
  ["🌱 Plant guide", "Light, water and soil tips for popular houseplants."],
];

function Home() {
  const [now, setNow] = useState(new Date());

  // Live clock: starts when the page mounts, stops when you leave it
  useEffect(() => {
    console.log("Clock started (component mounted)");
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(id);
      console.log("Clock stopped (component unmounted)");
    };
  }, []);

  const h = now.getHours();
  const greeting = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <section className="hero">
        <p className="eyebrow">{greeting} · {now.toLocaleTimeString()}</p>
        <h1>Keep every plant happy, <em>effortlessly.</em></h1>
        <p className="lead">LeafLog tracks when your plants were last watered and shows what needs attention today.</p>
        <div className="row">
          <Link className="btn" to="/plants">Open my garden</Link>
          <Link className="btn ghost" to="/guide">Browse care guide</Link>
        </div>
      </section>
      <div className="grid">
        {features.map(([t, d]) => (
          <div className="box" key={t}><h3>{t}</h3><p className="muted">{d}</p></div>
        ))}
      </div>
    </>
  );
}

export default Home;
