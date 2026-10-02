import { useEffect, useMemo, useRef, useState } from "react";
import api from "../api";
import PlantCard from "../components/PlantCard";

const emptyForm = { name: "", species: "", wateringEveryDays: 3, notes: "" };

function Plants() {
  const [plants, setPlants] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const nameRef = useRef(null);

  // Load plants from the API when the page opens
  useEffect(() => {
    api.get("/plants")
      .then((res) => setPlants(res.data))
      .catch(() => setError("We couldn't load your plants. Please try again in a moment."))
      .finally(() => setLoading(false));
  }, []);

  // Browser tab shows how many plants need water
  const dueCount = useMemo(
    () => plants.filter((p) => Date.now() - new Date(p.lastWatered) >= p.wateringEveryDays * 86400000).length,
    [plants]
  );
  useEffect(() => { document.title = `LeafLog (${dueCount} thirsty)`; }, [dueCount]);

  // Focus the name box when the form opens
  useEffect(() => { if (showForm) nameRef.current.focus(); }, [showForm]);

  // Hide the toast after 2.5 seconds
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addPlant = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/plants", { ...form, wateringEveryDays: Number(form.wateringEveryDays) });
      setPlants([res.data, ...plants]);
      setForm(emptyForm);
      setShowForm(false);
      setError("");
      setToast(`${res.data.name} added to your garden 🌱`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not add plant");
    }
  };

  const waterPlant = async (id) => {
    try {
      const res = await api.patch(`/plants/${id}/water`);
      setPlants(plants.map((p) => (p._id === id ? res.data : p)));
      setToast(`${res.data.name} watered 💧`);
    } catch { setError("Could not update plant"); }
  };

  const deletePlant = async (id) => {
    if (!window.confirm("Remove this plant from your garden?")) return;
    try {
      await api.delete(`/plants/${id}`);
      setPlants(plants.filter((p) => p._id !== id));
      setToast("Plant removed");
    } catch { setError("Could not remove plant"); }
  };

  const shown = plants.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="between">
        <div>
          <h1>My Plants</h1>
          <p className="muted">{plants.length} in your garden · {dueCount} need water today</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}>{showForm ? "Close" : "+ Add plant"}</button>
      </div>

      {showForm && (
        <form className="box" onSubmit={addPlant}>
          <div className="row">
            <input ref={nameRef} name="name" value={form.name} onChange={handleChange} placeholder="Plant name *" />
            <input name="species" value={form.species} onChange={handleChange} placeholder="Species" />
            <input name="wateringEveryDays" type="number" min="1" value={form.wateringEveryDays} onChange={handleChange} title="Water every N days" />
          </div>
          <input name="notes" value={form.notes} onChange={handleChange} placeholder="Notes (optional)" />
          <button type="submit">Save plant</button>
        </form>
      )}

      <input className="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Search your plants" />

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading your garden...</p>}
      {!loading && !error && shown.length === 0 && <p className="muted">No plants found. Add your first one!</p>}

      <div className="grid">
        {shown.map((p) => (
          <PlantCard key={p._id} id={p._id} name={p.name} species={p.species}
            everyDays={p.wateringEveryDays} lastWatered={p.lastWatered}
            onWater={waterPlant} onDelete={deletePlant} />
        ))}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default Plants;
