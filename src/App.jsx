
import Logo from "./components/Logo";
import { Leaf, ChartNoAxesCombined, Target } from "lucide-react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Activity from "./pages/Activity";
import History from "./pages/History";
import Reports from "./pages/Reports";
import Goals from "./pages/Goals";
import Recommendations from "./pages/Recommendations";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";


function Home() {
  return (
    <>
      <header className="navbar">
        <div className="container nav-inner">
          <Logo size={42} />

          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
           <Link to="/login">Login</Link>
           <Link to="/register" className="btn btn-primary">
            Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="eyebrow">
                🌱 Small steps. Greener future.
              </span>

              <h1>
                Understand your impact.
                <br />
                <span>Change your future.</span>
              </h1>

              <p>
                Track your carbon footprint, discover sustainable habits,
                and take meaningful steps toward a cleaner planet.
                Your journey to a greener lifestyle starts here.
              </p>

              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary">
                 Start Tracking →
                 </Link>

                <a href="#features" className="btn btn-outline">
                  Explore Features
                </a>
              </div>
            </div>

            <div className="preview-card">
              <div className="preview-top">
                <div>
                  <strong>Your carbon overview</strong>
                  <div className="preview-label">
                    Illustrative dashboard preview
                  </div>
                </div>
                <Logo size={48} />
              </div>

              <div className="preview-number">
                2.4 <small>tonnes CO₂e</small>
              </div>

              <div className="preview-label">
                Example monthly carbon footprint
              </div>

              <div className="progress-track">
                <div className="progress-fill" />
              </div>

              <div className="preview-stat">
                <span>Monthly goal progress</span>
                <strong>62%</strong>
              </div>

              <div className="preview-stat">
                <span>Suggested next step</span>
                <strong>Travel smarter</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <div className="container">
            <div className="section-heading">
              <h2>Everything you need to go greener</h2>
              <p>
                Make sense of your daily habits and turn your climate
                goals into practical actions.
              </p>
            </div>

            <div className="features-grid">
              <article className="feature-card">
                <div className="feature-icon">
                  <Logo size={48} />
                </div>
                <h3>Track your footprint</h3>
                <p>
                  Record travel, energy use, food, and other activities
                  to estimate your carbon emissions.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">
                  <ChartNoAxesCombined
                    color="#16834a"
                    size={25}
                  />
                </div>
                <h3>Understand your impact</h3>
                <p>
                  Explore your activity history and visualise emission
                  patterns with reports and charts.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon">
                  <Target color="#16834a" size={25} />
                </div>
                <h3>Reach your goals</h3>
                <p>
                  Set personal reduction targets and discover practical
                  recommendations for sustainable living.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="container" id="how-it-works">
          <div className="cta">
            <h2>Your greener journey starts today</h2>
            <p>
              Build awareness, make informed choices, and track your progress.
            </p>
            <a href="#register" className="btn btn-primary">
              Create Your Account →
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          © {new Date().getFullYear()} CarbonTrack. Every action counts.
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/activity" element={<Activity />} />
      <Route path="/history" element={<History />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/recommendations" element={<Recommendations />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}