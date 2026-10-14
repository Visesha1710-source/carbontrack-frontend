
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Logo from "../components/Logo";
import {
  Leaf,
  TrendingDown,
  Car,
  Zap,
  Utensils,
  Target,
  ArrowLeft,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const ACTIVITIES_API = "/api/activities";
const GOALS_API = "/api/goals";

const emptyWeek = () => {
  const result = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);

    result.push({
      date: [
        day.getFullYear(),
        String(day.getMonth() + 1).padStart(2, "0"),
        String(day.getDate()).padStart(2, "0"),
      ].join("-"),
      day: day.toLocaleDateString("en-US", { weekday: "short" }),
      emissions: 0,
    });
  }

  return result;
};

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function handleLogout() {
    try {
      await axios.post(
        "/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      window.location.href = "/login";
    }
  }

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [activityResponse, goalResponse] = await Promise.all([
          fetch(ACTIVITIES_API, { credentials: "include" }),
          fetch(GOALS_API, { credentials: "include" }),
        ]);

        if (!activityResponse.ok || !goalResponse.ok) {
          throw new Error("Could not load dashboard data.");
        }

        const [activityData, goalData] = await Promise.all([
          activityResponse.json(),
          goalResponse.json(),
        ]);

        if (active) {
          setActivities(Array.isArray(activityData) ? activityData : []);
          setGoals(Array.isArray(goalData) ? goalData : []);
        }
      } catch (err) {
        if (active) {
          setError(
            "Could not load live data. Check that your backend is running."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const total = activities.reduce(
    (sum, activity) => sum + (Number(activity.total) || 0),
    0
  );

  const averageGoalProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce(
            (sum, goal) =>
              sum +
              Math.min(100, Math.max(0, Number(goal.progress) || 0)),
            0
          ) / goals.length
        )
      : 0;

  const completedGoals = goals.filter(
    (goal) => Number(goal.progress) >= 100
  ).length;

  const weeklyData = emptyWeek().map((day) => ({
    ...day,
    emissions: activities
      .filter((activity) => activity.activityDate === day.date)
      .reduce((sum, activity) => sum + (Number(activity.total) || 0), 0),
  }));

  const sourceCounts = [
    {
      name: "Transport",
      amount: activities.filter(
        (a) => String(a.transport || "").trim() !== ""
      ).length,
      icon: Car,
      color: "#16a34a",
    },
    {
      name: "Electricity",
      amount: activities.filter((a) => Number(a.electricity) > 0).length,
      icon: Zap,
      color: "#eab308",
    },
    {
      name: "Food",
      amount: activities.filter(
        (a) => String(a.food || "").trim() !== ""
      ).length,
      icon: Utensils,
      color: "#f97316",
    },
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <Link to="/" className="dashboard-brand">
          <Logo size={48} />
        </Link>

        <Link to="/" className="dashboard-back">
          <ArrowLeft size={17} /> Home
        </Link>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-welcome">
          <div>
            <p className="dashboard-eyebrow">YOUR PERSONAL OVERVIEW</p>
            <h1>Carbon Dashboard 🌱</h1>
            <p>Small steps today, a greener planet tomorrow.</p>
          </div>

          <div className="dashboard-date">
            <Logo size={48} /> Keep it green!
          </div>

          <Link to="/activity" className="activity-submit dashboard-action">
            + Add Activity
          </Link>
        </div>

        {error && (
          <p role="alert" style={{ color: "#dc2626" }}>
            {error}
          </p>
        )}

        <section className="dashboard-panels">
          <Link to="/activity" className="dashboard-panel dashboard-nav-card">
            <h2>📝 Activity Tracker</h2>
            <p>Record your daily carbon emissions.</p>
          </Link>

          <Link to="/history" className="dashboard-panel dashboard-nav-card">
            <h2>📋 Activity History</h2>
            <p>Review your saved activity records.</p>
          </Link>

          <Link to="/reports" className="dashboard-panel dashboard-nav-card">
            <h2>📊 Reports & Analytics</h2>
            <p>Explore your emissions charts.</p>
          </Link>

          <Link to="/goals" className="dashboard-panel dashboard-nav-card">
            <h2>🎯 Sustainability Goals</h2>
            <p>Set and track your green goals.</p>
          </Link>

          <Link
            to="/recommendations"
            className="dashboard-panel dashboard-nav-card"
          >
            <h2>🌱 Recommendations</h2>
            <p>Discover greener everyday habits.</p>
          </Link>

          <Link to="/profile" className="dashboard-panel dashboard-nav-card">
            <h2>👤 My Profile</h2>
            <p>Manage your profile details.</p>
          </Link>

          <Link to="/settings" className="dashboard-panel dashboard-nav-card">
            <h2>⚙️ Settings</h2>
            <p>Customize your preferences.</p>
          </Link>
        </section>

        <section className="dashboard-stats">
          <article className="dashboard-stat main-stat">
            <div className="stat-icon">
              <Leaf size={23} />
            </div>
            <p>Total Carbon Footprint</p>
            <h2>
              {total.toFixed(2)} <span>kg CO₂</span>
            </h2>
            <small>
              {loading ? "Loading..." : `${activities.length} saved activities`}
            </small>
          </article>

          <article className="dashboard-stat">
            <div className="stat-icon">
              <TrendingDown size={23} />
            </div>
            <p>Activities Recorded</p>
            <h2>{loading ? "..." : activities.length}</h2>
            <small>All saved activity records</small>
          </article>

          <article className="dashboard-stat">
            <div className="stat-icon">
              <Target size={23} />
            </div>
            <p>Goals Tracked</p>
            <h2>{loading ? "..." : goals.length}</h2>
            <small>{completedGoals} completed goals</small>
          </article>
        </section>

        <section className="dashboard-panels">
          <article className="dashboard-panel chart-panel">
            <div className="panel-heading">
              <div>
                <h2>Weekly Emissions</h2>
                <p>Recorded daily carbon output in kg CO₂</p>
              </div>
              <span className="panel-tag">7 days</span>
            </div>

            <div className="chart-area">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar
                    dataKey="emissions"
                    name="kg CO₂"
                    fill="#16a34a"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <h2>Recorded Activity Types</h2>
                <p>Fields present in your saved activities</p>
              </div>
            </div>

            <div className="category-list">
              {sourceCounts.map((category) => {
                const Icon = category.icon;

                return (
                  <div className="category-item" key={category.name}>
                    <div
                      className="category-icon"
                      style={{ color: category.color }}
                    >
                      <Icon size={21} />
                    </div>

                    <div className="category-details">
                      <div className="category-label">
                        <span>{category.name}</span>
                        <strong>{category.amount}</strong>
                      </div>

                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${
                              activities.length
                                ? (category.amount / activities.length) * 100
                                : 0
                            }%`,
                            backgroundColor: category.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        <section className="dashboard-panel goal-panel">
          <div className="goal-icon">
            <Target size={28} />
          </div>

          <div className="goal-content">
            <h2>Your Sustainability Goals</h2>
            <p>Average progress across your saved goals.</p>

            <div className="goal-progress-track">
              <div
                className="goal-progress-fill"
                style={{ width: `${averageGoalProgress}%` }}
              />
            </div>

            <div className="goal-labels">
              <span>{goals.length} goals saved</span>
              <strong>{averageGoalProgress}% average progress</strong>
            </div>
          </div>
        </section>

        <p className="dashboard-note">
          Figures are calculated from activities and goals saved in your
          database. Weekly emissions include records dated within the last
          seven calendar days.
        </p>
      </main>
    </div>
  );
}
