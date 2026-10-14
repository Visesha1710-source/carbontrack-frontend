import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Leaf, ArrowLeft, Trash2, RefreshCw } from "lucide-react";
import axios from "axios";
import Logo from "../components/Logo";

const API_URL = "/api/activities";

export default function History() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL, {
  withCredentials: true,
});
      setActivities(response.data);
    } catch (err) {
      console.error("Failed to load activities:", err);
      setError(
        "Could not load activities. Make sure your Spring Boot backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  async function deleteActivity(id) {
    if (!window.confirm("Are you sure you want to delete this activity?")) {
      return;
    }

    try {
      setDeletingId(id);
      await axios.delete(`${API_URL}/${id}`, {
  withCredentials: true,
});
      setActivities((previous) =>
        previous.filter((item) => item.id !== id)
      );
      setError("");
    } catch (err) {
      console.error("Failed to delete activity:", err);
      setError("Could not delete this activity. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(item) {
    const date = item.activityDate || item.date;
    if (!date) return "—";

    const parsedDate = new Date(`${date}`.slice(0, 10) + "T00:00:00");
    return Number.isNaN(parsedDate.getTime())
      ? date
      : parsedDate.toLocaleDateString();
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <Link to="/" className="dashboard-brand">
          <Logo size={48} />
        </Link>

        <Link to="/dashboard" className="dashboard-back">
          <ArrowLeft size={17} /> Dashboard
        </Link>
      </header>

      <main className="dashboard-content">
        <p className="dashboard-eyebrow">YOUR RECORDS</p>
        <h1>Activity History 📋</h1>
        <p>Review your saved carbon activities.</p>

        <section className="dashboard-panel" style={{ marginTop: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <h2 style={{ margin: 0 }}>Saved Activities</h2>

            <button
              type="button"
              onClick={fetchActivities}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {error && (
            <p role="alert" style={{ color: "crimson", marginBottom: 16 }}>
              {error}
            </p>
          )}

          {loading ? (
            <p>Loading activities from MySQL...</p>
          ) : activities.length === 0 ? (
            <p>
              No saved activities yet. Add an activity from the Activity page!
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ padding: 12 }}>Date</th>
                    <th style={{ padding: 12 }}>Activity</th>
                    <th style={{ padding: 12 }}>Emissions</th>
                    <th style={{ padding: 12 }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {activities.map((item) => (
                    <tr key={item.id}>
                      <td style={{ padding: 12 }}>{formatDate(item)}</td>
                      <td style={{ padding: 12 }}>
                        {item.name || "Activity"}
                      </td>
                      <td style={{ padding: 12 }}>
                        {Number(item.total || 0).toFixed(2)} kg CO₂e
                      </td>
                      <td style={{ padding: 12 }}>
                        <button
                          type="button"
                          onClick={() => deleteActivity(item.id)}
                          disabled={deletingId === item.id}
                          aria-label={`Delete ${item.name || "activity"}`}
                          title="Delete activity"
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
