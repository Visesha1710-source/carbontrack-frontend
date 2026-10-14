import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  ArrowLeft,
  Target,
  CheckCircle2,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import Logo from "../components/Logo";

const API_URL = "/api/goals";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const loadGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL, {
  withCredentials: true,
});
      setGoals(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Could not load goals:", err);
      setError(
        "Could not load goals. Make sure your Spring Boot backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  async function addGoal(e) {
    e.preventDefault();

    const title = newGoal.trim();
    if (!title || saving) return;

    try {
      setSaving(true);
      setError("");

      const response = await axios.post(API_URL, {
        title,
        detail: "Personal sustainability goal",
        progress: 0,
      },
  {
    withCredentials: true,
  }
    );

      setGoals((previous) => [...previous, response.data]);
      setNewGoal("");
    } catch (err) {
      console.error("Could not add goal:", err);
      setError("Could not add your goal. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function updateProgress(goal) {
    if (goal.progress >= 100 || busyId !== null) return;

    const updatedGoal = {
      ...goal,
      progress: Math.min(goal.progress + 10, 100),
    };

    try {
      setBusyId(goal.id);
      setError("");

      const response = await axios.put(
        `${API_URL}/${goal.id}`,
        updatedGoal,
  {
    withCredentials: true,
  }
      );

      setGoals((previous) =>
        previous.map((item) =>
          item.id === goal.id ? response.data : item
        )
      );
    } catch (err) {
      console.error("Could not update goal:", err);
      setError("Could not update progress. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteGoal(id) {
    if (busyId !== null) return;

    if (!window.confirm("Are you sure you want to delete this goal?")) {
      return;
    }

    try {
      setBusyId(id);
      setError("");

      await axios.delete(`${API_URL}/${id}`,
  {
    withCredentials: true,
  });

      setGoals((previous) =>
        previous.filter((goal) => goal.id !== id)
      );
    } catch (err) {
      console.error("Could not delete goal:", err);
      setError("Could not delete this goal. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <Link to="/" className="dashboard-brand">
          <Logo size={48} />
        </Link>

        <Link to="/dashboard" className="dashboard-back">
          <ArrowLeft size={17} />
          Dashboard
        </Link>
      </header>

      <main className="dashboard-content">
        <p className="dashboard-eyebrow">SMALL STEPS, BIG IMPACT</p>
        <h1>My Sustainability Goals 🎯</h1>

        <p style={{ color: "#718078" }}>
          Set targets, track your progress, and build greener habits.
        </p>

        <form
          onSubmit={addGoal}
          className="dashboard-panel"
          style={{
            marginTop: 25,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <input
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Enter a new sustainability goal..."
            aria-label="New sustainability goal"
            required
            style={{
              flex: "1 1 240px",
              minWidth: 0,
              padding: 13,
              border: "1px solid #dce5dd",
              borderRadius: 10,
            }}
          />

          <button
            type="submit"
            className="activity-submit"
            disabled={saving}
          >
            <Plus size={17} />
            {saving ? "Adding..." : "Add Goal"}
          </button>
        </form>

        {error && (
          <p role="alert" style={{ color: "crimson", marginTop: 16 }}>
            {error}
          </p>
        )}

        <div style={{ marginTop: 18 }}>
          <button
            type="button"
            onClick={loadGoals}
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 12px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            <RefreshCw size={16} />
            Refresh goals
          </button>
        </div>

        <section style={{ display: "grid", gap: 18, marginTop: 22 }}>
          {loading ? (
            <article className="dashboard-panel">
              Loading goals from MySQL...
            </article>
          ) : goals.length === 0 ? (
            <article className="dashboard-panel">
              No goals yet. Add your first sustainability goal above!
            </article>
          ) : (
            goals.map((goal) => (
              <article className="dashboard-panel" key={goal.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 13,
                  }}
                >
                  <Target size={25} color="#16a34a" />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ margin: "0 0 7px" }}>
                      {goal.title}
                    </h2>

                    <p
                      style={{
                        color: "#718078",
                        margin: "0 0 18px",
                        fontSize: 14,
                      }}
                    >
                      {goal.detail}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                        fontSize: 13,
                      }}
                    >
                      <span>Progress</span>
                      <strong>{goal.progress}%</strong>
                    </div>

                    <div
                      style={{
                        height: 9,
                        background: "#e8eee8",
                        borderRadius: 10,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${goal.progress}%`,
                          height: "100%",
                          background: "#16a34a",
                          borderRadius: 10,
                          transition: "width 0.3s",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                        marginTop: 16,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => updateProgress(goal)}
                        disabled={goal.progress >= 100 || busyId !== null}
                        style={{
                          padding: "9px 13px",
                          border: "1px solid #16a34a",
                          borderRadius: 9,
                          background:
                            goal.progress >= 100 ? "#e8f5e9" : "white",
                          color: "#15803d",
                          cursor:
                            goal.progress >= 100 || busyId !== null
                              ? "not-allowed"
                              : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 7,
                        }}
                      >
                        {goal.progress >= 100 ? (
                          <>
                            <CheckCircle2 size={16} />
                            Completed
                          </>
                        ) : (
                          "Update Progress +10%"
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteGoal(goal.id)}
                        disabled={busyId !== null}
                        aria-label={`Delete ${goal.title}`}
                        style={{
                          padding: "9px 12px",
                          border: "1px solid #e5e7eb",
                          borderRadius: 9,
                          background: "white",
                          color: "#64748b",
                          cursor:
                            busyId !== null ? "not-allowed" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}