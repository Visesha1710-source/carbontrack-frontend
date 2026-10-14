import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Logo from "../components/Logo";
import { Leaf, ArrowLeft, Car, Zap, Utensils } from "lucide-react";

const API_URL = "/api/activities";

export default function Activity() {
  const [transport, setTransport] = useState("");
  const [electricity, setElectricity] = useState("");
  const [food, setFood] = useState("balanced");
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function calculateEmissions(e) {
    e.preventDefault();
    setError("");

    const travelEmission = Number(transport || 0) * 0.21;
    const electricityEmission = Number(electricity || 0) * 0.4;
    const foodEmission =
      food === "meat" ? 5 :
      food === "vegetarian" ? 2.5 : 1.5;

    const total =
      travelEmission + electricityEmission + foodEmission;

    const activity = {
      date: new Date().toLocaleDateString(),
      name: "Daily activity",
      transport: travelEmission,
      electricity: electricityEmission,
      food: foodEmission,
      total,
    };

    setSaving(true);

    try {
      // Save the activity in the Spring Boot backend / MySQL.
      const response = await axios.post(API_URL, {
        activityDate: new Date().toISOString().slice(0, 10),
        name: activity.name,
        transport: String(travelEmission),
        electricity: electricityEmission,
        food: String(foodEmission),
        total,
      },
    {
      withCredentials: true,
    }
);

      const savedActivity = {
        ...activity,
        id: response.data.id,
      };

      // Keep localStorage working for the existing History and Reports pages.
      const existing = JSON.parse(
        localStorage.getItem("carbonActivities") || "[]"
      );

      localStorage.setItem(
        "carbonActivities",
        JSON.stringify([savedActivity, ...existing])
      );

      setResult(savedActivity);
    } catch (err) {
      console.error("Could not save activity:", err);
      setError(
        "Could not save to the backend. Check that Spring Boot is running on port 8080."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="activity-page">
      <header className="dashboard-header">
        <Link to="/" className="dashboard-brand">
          <Logo size={48} />
        </Link>
        <Link to="/dashboard" className="dashboard-back">
          <ArrowLeft size={17} /> Dashboard
        </Link>
      </header>

      <main className="activity-content">
        <p className="dashboard-eyebrow">TRACK YOUR IMPACT</p>
        <h1>Log Your Daily Activity 🌱</h1>
        <p className="activity-intro">
          Enter your daily usage to estimate your carbon footprint.
        </p>

        <form className="activity-form" onSubmit={calculateEmissions}>
          <label>
            <span><Car size={19} /> Travel distance (km)</span>
            <input
              type="number"
              min="0"
              step="any"
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              placeholder="e.g. 12"
              required
            />
          </label>

          <label>
            <span><Zap size={19} /> Electricity used (kWh)</span>
            <input
              type="number"
              min="0"
              step="any"
              value={electricity}
              onChange={(e) => setElectricity(e.target.value)}
              placeholder="e.g. 5"
              required
            />
          </label>

          <label>
            <span><Utensils size={19} /> Your food choice today</span>
            <select
              value={food}
              onChange={(e) => setFood(e.target.value)}
            >
              <option value="balanced">Mostly plant-based</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="meat">Meat-heavy</option>
            </select>
          </label>

          <button
            type="submit"
            className="activity-submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Calculate My Footprint"}
          </button>
        </form>

        {error && <p role="alert">{error}</p>}

        {result && (
          <section className="activity-result">
            <h2>Your Estimated Emissions</h2>
            <p className="activity-total">
              {result.total.toFixed(2)} <span>kg CO₂e</span>
            </p>
            <p>Transport: {result.transport.toFixed(2)} kg</p>
            <p>Electricity: {result.electricity.toFixed(2)} kg</p>
            <p>Food estimate: {result.food.toFixed(2)} kg</p>
            <p className="activity-disclaimer">
              These are simplified example factors, not a verified carbon
              audit. Transport estimates vary by vehicle and fuel, and
              electricity factors vary by location.
            </p>
            <p>✅ Activity saved to the database!</p>
          </section>
        )}
      </main>
    </div>
  );
}