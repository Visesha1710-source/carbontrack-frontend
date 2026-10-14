import { Link } from "react-router-dom";
import {
Leaf,
ArrowLeft,
Car,
Zap,
Utensils,
Recycle,
Droplets,
Sun,
ArrowUpRight,
} from "lucide-react";
import Logo from "../components/Logo";

const recommendations = [
{
icon: Car,
category: "TRANSPORT",
title: "Choose greener travel",
description:
"Walk, cycle, carpool, or use public transport instead of driving alone.",
impact: "Potentially high impact",
color: "#16a34a",
background: "#e8f7ed",
},
{
icon: Zap,
category: "ENERGY",
title: "Reduce electricity use",
description:
"Switch off unused lights, unplug idle devices, and choose energy-efficient appliances.",
impact: "Potentially high impact",
color: "#ca8a04",
background: "#fef9c3",
},
{
icon: Utensils,
category: "FOOD",
title: "Try more plant-based meals",
description:
"Replace some meat-heavy meals with vegetables, legumes, and other plant-based foods.",
impact: "Moderate to high impact",
color: "#ea580c",
background: "#ffedd5",
},
{
icon: Recycle,
category: "WASTE",
title: "Reuse and recycle",
description:
"Carry reusable bags and bottles, avoid unnecessary packaging, and sort recyclable waste.",
impact: "Everyday positive impact",
color: "#0891b2",
background: "#e0f2fe",
},
{
icon: Droplets,
category: "WATER",
title: "Save water",
description:
"Take shorter showers, fix leaks, and avoid wasting treated water.",
impact: "Save water and energy",
color: "#2563eb",
background: "#dbeafe",
},
{
icon: Sun,
category: "LIFESTYLE",
title: "Make sustainable choices",
description:
"Buy only what you need, repair items, and choose durable products.",
impact: "Long-term benefits",
color: "#9333ea",
background: "#f3e8ff",
},
];

export default function Recommendations() {
return ( <div className="dashboard-page"> <header className="dashboard-header"> <Link to="/" className="dashboard-brand"> <Logo size={48} />
</Link>


    <Link to="/dashboard" className="dashboard-back">
      <ArrowLeft size={17} />
      Dashboard
    </Link>
  </header>

  <main className="dashboard-content">
    <p className="dashboard-eyebrow">LIVE GREENER EVERY DAY</p>
    <h1>Recommendations 🌱</h1>
    <p style={{ color: "#718078", lineHeight: 1.7 }}>
      Simple actions that can help you reduce your environmental impact.
      Start small and build sustainable habits over time.
    </p>

    <section
      className="dashboard-stats"
      style={{ marginTop: 25 }}
    >
      <article className="dashboard-stat main-stat">
        <div className="stat-icon">
          <Leaf size={23} />
        </div>
        <p>Your next step</p>
        <h2 style={{ fontSize: 21 }}>Choose one green habit</h2>
        <small>Consistency matters more than perfection.</small>
      </article>

      <article className="dashboard-stat">
        <div className="stat-icon">
          <Recycle size={23} />
        </div>
        <p>Simple actions</p>
        <h2>6 ideas</h2>
        <small>Explore practical everyday changes.</small>
      </article>
    </section>

    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))",
        gap: 18,
        marginTop: 25,
      }}
    >
      {recommendations.map((item) => {
        const Icon = item.icon;

        return (
          <article
            className="dashboard-panel"
            key={item.title}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                display: "grid",
                placeItems: "center",
                borderRadius: 14,
                background: item.background,
                color: item.color,
                marginBottom: 16,
              }}
            >
              <Icon size={25} />
            </div>

            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                color: item.color,
                margin: "0 0 8px",
              }}
            >
              {item.category}
            </p>

            <h2 style={{ margin: "0 0 10px", fontSize: 19 }}>
              {item.title}
            </h2>

            <p
              style={{
                color: "#718078",
                lineHeight: 1.7,
                fontSize: 14,
                flex: 1,
              }}
            >
              {item.description}
            </p>

            <div
              style={{
                borderTop: "1px solid #edf0ed",
                paddingTop: 14,
                marginTop: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 12, color: "#64748b" }}>
                {item.impact}
              </span>
              <ArrowUpRight size={18} color={item.color} />
            </div>
          </article>
        );
      })}
    </section>

    <p className="dashboard-note" style={{ marginTop: 24 }}>
      These are general sustainability suggestions, not personalized
      calculations. Recommendations can be tailored once activity data
      is connected.
    </p>
  </main>
</div>

);
}
