import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api";

function PlantDetail() {
  const { id } = useParams();          // reads :id from the URL
  const navigate = useNavigate();      // moves to another route
  const [plant, setPlant] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get(`/plants/${id}`)
      .then((res) => setPlant(res.data))
      .catch(() => setError("Plant not found"));
  }, [id]);

  const handleChange = (e) => {
    setSaved(false);
    setPlant({ ...plant, [e.target.name]: e.target.value });
  };

  const save = async () => {
    try {
      const res = await api.put(`/plants/${id}`, {
        name: plant.name,
        species: plant.species,
        wateringEveryDays: Number(plant.wateringEveryDays),
        notes: plant.notes,
      });
      setPlant(res.data);
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save");
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete this plant?")) return;
    await api.delete(`/plants/${id}`);
    navigate("/plants");
  };

  if (error) {
    return (
      <div>
        <p className="error">{error}</p>
        <Link to="/plants">Back to plants</Link>
      </div>
    );
  }
  if (!plant) return <p className="muted">Loading...</p>;

  return (
    <div>
      <h1>{plant.name}</h1>
      <div className="box">
        <label>Name</label>
        <input name="name" value={plant.name} onChange={handleChange} />
        <label>Species</label>
        <input name="species" value={plant.species || ""} onChange={handleChange} />
        <label>Water every (days)</label>
        <input name="wateringEveryDays" type="number" min="1" value={plant.wateringEveryDays} onChange={handleChange} />
        <label>Notes</label>
        <input name="notes" value={plant.notes || ""} onChange={handleChange} />
        <div className="actions">
          <button onClick={save}>Save changes</button>
          <button className="danger" onClick={remove}>Delete</button>
          <button className="secondary" onClick={() => navigate(-1)}>Back</button>
        </div>
        {saved && <p className="ok">Saved to database.</p>}
      </div>
    </div>
  );
}

export default PlantDetail;
