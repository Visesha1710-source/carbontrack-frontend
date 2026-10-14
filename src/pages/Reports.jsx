
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  TrendingDown,
  BarChart3,
  Activity,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Logo from "../components/Logo";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const API_URL = "/api/activities";
const colors = ["#16a34a", "#eab308", "#f97316"];

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function getActivityDate(activity) {
  const value = activity.activityDate || activity.date;
  if (!value) return null;

  const match = String(value)
    .slice(0, 10)
    .match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (match) {
    return new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3])
    );
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export default function Reports() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL, {
        withCredentials: true,
      });

      setActivities(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("Could not load report data:", err);
      setError(
        "Could not load reports. Make sure your backend is running and you are logged in."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const weeklyData = (() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const emissions = activities.reduce((sum, activity) => {
        const activityDate = getActivityDate(activity);

        if (
          activityDate &&
          activityDate >= date &&
          activityDate < nextDate
        ) {
          return sum + safeNumber(activity.total);
        }

        return sum;
      }, 0);

      result.push({
        day: days[date.getDay()],
        emissions: Number(emissions.toFixed(2)),
      });
    }

    return result;
  })();

  const sourceData = [
    {
      name: "Transport",
      value: activities.reduce(
        (sum, activity) => sum + safeNumber(activity.transport),
        0
      ),
    },
    {
      name: "Electricity",
      value: activities.reduce(
        (sum, activity) => sum + safeNumber(activity.electricity),
        0
      ),
    },
    {
      name: "Food",
      value: activities.reduce(
        (sum, activity) => sum + safeNumber(activity.food),
        0
      ),
    },
  ].map((item) => ({
    ...item,
    value: Number(item.value.toFixed(2)),
  }));

  const total = Number(
    weeklyData
      .reduce((sum, day) => sum + day.emissions, 0)
      .toFixed(2)
  );

  const average = total / 7;

  const lowestDay = weeklyData.reduce(
    (lowest, day) =>
      day.emissions < lowest.emissions ? day : lowest,
    weeklyData[0]
  );

  const hasActivities = activities.length > 0;

  return (
    <div className="dashboard-page reports-page">
      <header className="dashboard-header">
        <Link
          to="/"
          className="dashboard-brand"
          aria-label="CarbonTrack home"
        >
          <Logo size={48} />
        </Link>

        <Link to="/dashboard" className="dashboard-back">
          <ArrowLeft size={17} />
          <span>Dashboard</span>
        </Link>
      </header>

      <main className="dashboard-content">
        <p className="dashboard-eyebrow">
          UNDERSTAND YOUR IMPACT
        </p>

        <h1>Reports &amp; Analytics 📊</h1>

        <p className="reports-description">
          Explore your real carbon footprint trends and emission sources.
        </p>

        <button
          type="button"
          className="reports-refresh"
          onClick={loadActivities}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "reports-refresh-icon spinning" : "reports-refresh-icon"}
          />
          {loading ? "Refreshing..." : "Refresh reports"}
        </button>

        {error && (
          <p role="alert" className="reports-error">
            {error}
          </p>
        )}

        {loading ? (
          <p className="reports-loading">
            Loading report data from MySQL...
          </p>
        ) : (
          <>
            <section
              className="dashboard-stats"
              style={{ marginTop: 25 }}
            >
              <article className="dashboard-stat main-stat">
                <div className="stat-icon">
                  <TrendingDown size={23} />
                </div>
                <p>Total Weekly Emissions</p>
                <h2>
                  {total.toFixed(1)} <span>kg CO₂e</span>
                </h2>
                <small>
                  Based on activities from the last 7 days
                </small>
              </article>

              <article className="dashboard-stat">
                <div className="stat-icon">
                  <Activity size={23} />
                </div>
                <p>Daily Average</p>
                <h2>
                  {average.toFixed(1)} <span>kg CO₂e</span>
                </h2>
                <small>Weekly emissions divided by 7</small>
              </article>

              <article className="dashboard-stat">
                <div className="stat-icon">
                  <TrendingDown size={23} />
                </div>
                <p>Lowest Emission Day</p>
                <h2>
                  {lowestDay.emissions.toFixed(1)} <span>kg</span>
                </h2>
                <small>{lowestDay.day} · Last 7 days</small>
              </article>
            </section>

            <section className="dashboard-panels">
              <article className="dashboard-panel">
                <h2>
                  <BarChart3 size={20} />
                  Weekly Analysis
                </h2>

                <p className="reports-chart-description">
                  Daily emissions in kilograms of CO₂e
                </p>

                <div className="chart-area">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="emissions"
                        name="Emissions (kg CO₂e)"
                        fill="#16a34a"
                        radius={[5, 5, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="dashboard-panel">
                <h2>Emission Breakdown</h2>

                <p className="reports-chart-description">
                  Recorded emissions by source (kg CO₂e)
                </p>

                <div className="chart-area">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        outerRadius={78}
                        label={({ name, value }) =>
                          `${name}: ${value}`
                        }
                      >
                        {sourceData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={colors[index]}
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={(value) => `${value} kg CO₂e`}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </article>
            </section>

            {!hasActivities && (
              <p className="dashboard-note">
                No saved activities yet. Add an activity to start
                building your reports.
              </p>
            )}

            {hasActivities && total === 0 && (
              <p className="dashboard-note">
                You have saved activities, but none fall within the
                last 7 days. Your source breakdown includes all
                saved activities.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
