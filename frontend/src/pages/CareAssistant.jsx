import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { daysSince } from "../utils";
import {
  checkPlants, reminderMessage, symptoms, careAdvice,
  buildPlan, planTotal, dayLabel, nextWateringDate,
} from "../careLogic";

function CareAssistant() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState([]);      // result of "Check My Plants"
  const [selectedId, setSelectedId] = useState("");
  const [symptom, setSymptom] = useState("healthy");
  const [advice, setAdvice] = useState("");
  const [plan, setPlan] = useState(null);
  const [notice, setNotice] = useState("");

  // Load the user's plants from the API when the page opens
  useEffect(() => {
    api.get("/plants")
      .then((res) => {
        setPlants(res.data);
        if (res.data.length > 0) setSelectedId(res.data[0]._id);
      })
      .catch(() => setError("We couldn't load your plants. Please try again in a moment."))
      .finally(() => setLoading(false));
  }, []);

  const selected = plants.find((p) => p._id === selectedId);

  const showNotice = (text) => {
    setNotice(text);
    setTimeout(function () { setNotice(""); }, 3000);
  };

  // 1. Check which plants are overdue, due today or not due yet
  const handleCheck = () => {
    const result = checkPlants(plants);
    setChecked(result);
    alert(`Watering reminder\n\n${reminderMessage(result)}`);
  };

  // 2. Mark the selected plant as watered
  const handleWater = async () => {
    if (!selected) return;
    if (!confirm(`Mark ${selected.name} as watered now?`)) return;
    try {
      const res = await api.patch(`/plants/${selected._id}/water`);
      const updated = plants.map((p) => (p._id === selected._id ? res.data : p));
      setPlants(updated);
      if (checked.length > 0) setChecked(checkPlants(updated));
      setPlan(null);
      showNotice(`${res.data.name} marked as watered.`);
      alert(`${res.data.name} marked as watered.\nNext watering: ${nextWateringDate(res.data)}`);
    } catch (err) {
      alert("Sorry, we could not update this plant. Please try again.");
    }
  };

  // 3. Plant health check
  const handleAdvice = () => {
    if (!selected) return;
    const text = careAdvice(selected, symptom);
    setAdvice(text);
    alert(`Care suggestion\n\n${text}`);
  };

  // 4. Watering plan for the next N days
  const handlePlan = () => {
    const answer = prompt("How many upcoming days do you want to plan for? (1-14)", "7");
    if (answer === null) return; // Cancel pressed
    const days = Number(answer);
    if (answer.trim() === "" || !Number.isInteger(days) || days < 1 || days > 14) {
      alert("Please enter a whole number between 1 and 14.");
      return;
    }
    setPlan({ days, entries: buildPlan(plants, days) });
  };

  return (
    <div className="assistant">
      <h1>Care Assistant</h1>
      <p className="muted">Check which plants need water, log a watering and plan your week.</p>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading your plants...</p>}

      {!loading && !error && plants.length === 0 && (
        <p className="muted">You have no plants yet. Add some on the <Link to="/plants">My Plants</Link> page first.</p>
      )}

      {!loading && !error && plants.length > 0 && (
        <>
          <div className="box">
            <h3>Check my plants</h3>
            <p className="muted small">See which plants are overdue, due today or not due yet.</p>
            <button onClick={handleCheck}>Check My Plants</button>
            {checked.map(({ plant, status }) => (
              <div className="row-item" key={plant._id}>
                <strong>{plant.name}</strong>
                <span className={`badge st-${status.key}`}>{status.label}</span>
                <span className="muted small">{status.text} · every {plant.wateringEveryDays} days</span>
              </div>
            ))}
          </div>

          <div className="box">
            <h3>Plant care</h3>
            <p className="muted small">Choose a plant to log a watering or check its health.</p>
            <label htmlFor="plantSelect">Plant</label>
            <select id="plantSelect" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              {plants.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            {selected && (
              <p className="muted small">
                Last watered {daysSince(selected.lastWatered)} day(s) ago · water every {selected.wateringEveryDays} days
              </p>
            )}
            <button onClick={handleWater}>Mark as watered</button>
            {notice && <p className="ok">{notice}</p>}

            <label htmlFor="symptomSelect">How does it look?</label>
            <select id="symptomSelect" value={symptom} onChange={(e) => setSymptom(e.target.value)}>
              {symptoms.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <div className="actions">
              <button onClick={handleAdvice}>Get advice</button>
            </div>
            {advice && <p>{advice}</p>}
          </div>

          <div className="box">
            <h3>Watering plan</h3>
            <p className="muted small">A day-by-day plan made from your own plants.</p>
            <button onClick={handlePlan}>Make watering plan</button>
            {plan && (
              <div className="plan">
                <p className="muted small">
                  Today and the next {plan.days} days · {planTotal(plan.entries)} watering(s) in total
                </p>
                {plan.entries.length === 0 && <p>No plant needs watering in this period.</p>}
                {plan.entries.map((entry) => (
                  <p className="plan-day" key={entry.day}>
                    <strong>{dayLabel(entry.day)}:</strong> {entry.plants.join(", ")}
                  </p>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CareAssistant;
