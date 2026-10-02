function GuideCard({ plant, saved, onToggle }) {
  return (
    <div className="card">
      <div className="between">
        <h3>{plant.name}</h3>
        <button className={`heart ${saved ? "on" : ""}`} onClick={() => onToggle(plant.name)}>
          {saved ? "♥" : "♡"}
        </button>
      </div>
      <span className="badge">{plant.type}</span>
      <p className="small">💧 {plant.water}</p>
      <p className="small">☀️ {plant.light}</p>
      <p className="muted small">{plant.tip}</p>
    </div>
  );
}

export default GuideCard;
