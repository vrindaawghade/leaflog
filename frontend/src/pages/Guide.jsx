import { useState } from "react";
import GuideCard from "../components/GuideCard";

const plants = [
  { name: "Tulsi", type: "Herbs", water: "Every 2 days", light: "Full sun", tip: "Pinch off flower buds to keep it bushy." },
  { name: "Mint", type: "Herbs", water: "Every 2 days", light: "Partial sun", tip: "Keep it in its own pot, it spreads fast." },
  { name: "Aloe Vera", type: "Succulents", water: "Every 7-10 days", light: "Bright light", tip: "Let the soil dry out fully between waterings." },
  { name: "Jade Plant", type: "Succulents", water: "Every 10 days", light: "Bright light", tip: "Wrinkled leaves mean it is thirsty." },
  { name: "Snake Plant", type: "Low light", water: "Every 10-14 days", light: "Low to bright", tip: "Almost impossible to kill. Do not overwater." },
  { name: "Money Plant", type: "Low light", water: "Every 4 days", light: "Indirect light", tip: "Grows well in water or soil." },
];
const types = ["All", "Herbs", "Succulents", "Low light"];

function Guide() {
  const [filter, setFilter] = useState("All");
  const [saved, setSaved] = useState([]);

  const toggle = (name) =>
    setSaved(saved.includes(name) ? saved.filter((n) => n !== name) : [...saved, name]);
  const shown = filter === "All" ? plants : plants.filter((p) => p.type === filter);

  return (
    <div>
      <h1>Plant care guide</h1>
      <p className="muted">Quick tips for popular houseplants. Tap the heart to save your favourites ({saved.length} saved).</p>
      <div className="row">
        {types.map((t) => (
          <button key={t} className={`chip ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>
      <div className="grid">
        {shown.map((p) => (
          <GuideCard key={p.name} plant={p} saved={saved.includes(p.name)} onToggle={toggle} />
        ))}
      </div>
    </div>
  );
}

export default Guide;
