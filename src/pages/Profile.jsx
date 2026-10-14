import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Leaf, ArrowLeft, UserRound, Mail, MapPin,
  CalendarDays, Pencil, Save, Target, Activity, RefreshCw,
} from "lucide-react";
import axios from "axios";
import Logo from "../components/Logo";

const PROFILE_API = "/api/profile";
const GOALS_API = "/api/goals";
const ACTIVITIES_API = "/api/activities";

const defaultProfile = {
  name: "CarbonTrack User",
  email: "user@example.com",
  location: "Your city",
};

export default function Profile() {
  const [profile, setProfile] = useState(defaultProfile);
  const [form, setForm] = useState(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [goalCount, setGoalCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      
const results = await Promise.allSettled([
  axios.get(PROFILE_API, { withCredentials: true }),
  axios.get(GOALS_API, { withCredentials: true }),
  axios.get(ACTIVITIES_API, { withCredentials: true }),
]);


      const [profileResult, goalsResult, activitiesResult] = results;

      if (profileResult.status === "fulfilled") {
        const data = profileResult.value.data;
        const loaded = {
          name: data.name || defaultProfile.name,
          email: data.email || defaultProfile.email,
          location: data.location || defaultProfile.location,
        };
        setProfile(loaded);
        setForm(loaded);
      } else {
        setError("Could not load your profile. Check that the backend is running.");
      }

      if (goalsResult.status === "fulfilled") {
        setGoalCount(Array.isArray(goalsResult.value.data)
          ? goalsResult.value.data.length : 0);
      }

      if (activitiesResult.status === "fulfilled") {
        setActivityCount(Array.isArray(activitiesResult.value.data)
          ? activitiesResult.value.data.length : 0);
      }
    } catch (err) {
      console.error("Could not load profile data:", err);
      setError("Could not load your profile data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleSave(e) {
    e.preventDefault();

    const updated = {
      name: form.name.trim() || defaultProfile.name,
      email: form.email.trim(),
      location: form.location.trim() || defaultProfile.location,
    };

    try {
      setSaving(true);
      setError("");
      setSaved(false);

      const response = await axios.put(PROFILE_API, updated, {
  withCredentials: true,
});
      const data = response.data;

      const savedProfile = {
        name: data.name,
        email: data.email,
        location: data.location,
      };

      setProfile(savedProfile);
      setForm(savedProfile);
      setEditing(false);
      setSaved(true);
    } catch (err) {
      console.error("Could not save profile:", err);
      setError("Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
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
        <p className="dashboard-eyebrow">YOUR PERSONAL SPACE</p>
        <h1>My Profile 👤</h1>
        <p style={{ color: "#718078" }}>
          Manage your personal details and sustainability journey.
        </p>

        <button
          type="button"
          onClick={loadProfile}
          disabled={loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "8px 12px",
            marginTop: 16,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          <RefreshCw size={16} /> Refresh profile
        </button>

        {error && (
          <p role="alert" style={{ color: "crimson", marginTop: 14 }}>
            {error}
          </p>
        )}

        <section
          className="dashboard-panel"
          style={{ marginTop: 25, padding: 28 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              flexWrap: "wrap",
              marginBottom: 25,
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                background: "#dcfce7",
                color: "#15803d",
                display: "grid",
                placeItems: "center",
              }}
            >
              <UserRound size={38} />
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{ margin: "0 0 6px" }}>{profile.name}</h2>
              <p style={{ color: "#718078", margin: 0 }}>
                CarbonTrack member
              </p>
            </div>

            {!editing && (
              <button
                type="button"
                className="activity-submit"
                onClick={() => {
                  setForm(profile);
                  setEditing(true);
                  setSaved(false);
                }}
              >
                <Pencil size={16} /> Edit Profile
              </button>
            )}
          </div>

          {loading && <p>Loading profile from MySQL...</p>}

          {saved && (
            <p role="status" style={{ color: "#15803d" }}>
              Profile saved successfully!
            </p>
          )}

          {editing ? (
            <form onSubmit={handleSave}>
              <label htmlFor="profile-name">Full name</label>
              <input
                id="profile-name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
                style={inputStyle}
              />

              <label htmlFor="profile-email">Email address</label>
              <input
                id="profile-email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
                style={inputStyle}
              />

              <label htmlFor="profile-location">City</label>
              <input
                id="profile-location"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                style={{ ...inputStyle, marginBottom: 22 }}
              />

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="submit"
                  className="activity-submit"
                  disabled={saving}
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForm(profile);
                    setEditing(false);
                    setError("");
                  }}
                  style={cancelStyle}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: "grid", gap: 20 }}>
              <InfoRow icon={<Mail size={20} />} label="Email address"
                value={profile.email} />
              <InfoRow icon={<MapPin size={20} />} label="Location"
                value={profile.location} />
              <InfoRow icon={<CalendarDays size={20} />} label="Membership"
                value="CarbonTrack member" />
            </div>
          )}
        </section>

        <section className="dashboard-stats" style={{ marginTop: 22 }}>
          <article className="dashboard-stat">
            <div className="stat-icon"><Target size={22} /></div>
            <p>My Goals</p>
            <h2>{loading ? "—" : goalCount}</h2>
            <small>Goals saved in the database</small>
          </article>

          <article className="dashboard-stat">
            <div className="stat-icon"><Activity size={22} /></div>
            <p>Activities Recorded</p>
            <h2>{loading ? "—" : activityCount}</h2>
            <small>Activities saved in the database</small>
          </article>
        </section>
      </main>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: 12,
  margin: "8px 0 18px",
  border: "1px solid #dce5dd",
  borderRadius: 10,
};

const cancelStyle = {
  padding: "11px 16px",
  border: "1px solid #dce5dd",
  borderRadius: 10,
  background: "white",
  cursor: "pointer",
};

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
      <span style={{ color: "#16a34a" }}>{icon}</span>
      <div>
        <small style={{ color: "#718078" }}>{label}</small>
        <p style={{ margin: "4px 0 0" }}>{value}</p>
      </div>
    </div>
  );
}