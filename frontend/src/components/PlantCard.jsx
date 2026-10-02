import { Link } from "react-router-dom";
import { daysSince } from "../utils";

function PlantCard({ id, name, species, everyDays, lastWatered, onWater, onDelete }) {
  const since = daysSince(lastWatered);
  const left = everyDays - since;
  const due = left <= 0;
  const pct = Math.min(100, Math.round((since / everyDays) * 100));

  return (
    <div className={`card ${due ? "due" : ""}`}>
      <h3><Link to={`/plants/${id}`}>{name}</Link></h3>
      <p className="muted">{species || "Houseplant"}</p>
      <div className="bar"><span style={{ width: `${pct}%` }} /></div>
      <p className="status">
        {due ? "💧 Needs water today" : `Next watering in ${left} day${left === 1 ? "" : "s"}`}
      </p>
      <p className="muted small">Every {everyDays} days · last watered {since === 0 ? "today" : `${since}d ago`}</p>
      <div className="actions">
        <button onClick={() => onWater(id)}>Water now</button>
        <button className="danger" onClick={() => onDelete(id)}>Remove</button>
      </div>
    </div>
  );
}

export default PlantCard;
