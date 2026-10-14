import { useState } from "react";
import { Link } from "react-router-dom";
import {
Leaf,
ArrowLeft,
Bell,
Moon,
Globe,
ShieldCheck,
Save,
RotateCcw,
} from "lucide-react";
import Logo from "../components/Logo";

const defaultSettings = {
notifications: true,
weeklyReport: true,
darkMode: false,
units: "kg",
};

export default function Settings() {
const [settings, setSettings] = useState(() => {
try {
return {
...defaultSettings,
...JSON.parse(localStorage.getItem("carbonSettings") || "{}"),
};
} catch {
return defaultSettings;
}
});

const [saved, setSaved] = useState(false);

function updateSetting(key, value) {
setSettings((current) => ({ ...current, [key]: value }));
setSaved(false);
}

function saveSettings(e) {
e.preventDefault();
localStorage.setItem("carbonSettings", JSON.stringify(settings));
setSaved(true);
}

function resetSettings() {
setSettings(defaultSettings);
localStorage.setItem("carbonSettings", JSON.stringify(defaultSettings));
setSaved(false);
}

const rowStyle = {
display: "flex",
alignItems: "center",
justifyContent: "space-between",
gap: 16,
padding: "18px 0",
borderBottom: "1px solid #edf0ed",
flexWrap: "wrap",
};

const switchStyle = (enabled) => ({
width: 46,
height: 26,
borderRadius: 20,
background: enabled ? "#16a34a" : "#cbd5e1",
position: "relative",
border: "none",
cursor: "pointer",
flexShrink: 0,
});

function Toggle({ checked, onChange, label }) {
return (
<button
type="button"
role="switch"
aria-checked={checked}
aria-label={label}
onClick={() => onChange(!checked)}
style={switchStyle(checked)}
>
<span
style={{
position: "absolute",
top: 3,
left: checked ? 23 : 3,
width: 20,
height: 20,
borderRadius: "50%",
background: "white",
transition: "left 0.2s",
}}
/> </button>
);
}

return ( <div className="dashboard-page"> <header className="dashboard-header"> <Link to="/" className="dashboard-brand"> <Logo size={48} /> </Link> <Link to="/dashboard" className="dashboard-back"> <ArrowLeft size={17} /> Dashboard </Link> </header>

  <main className="dashboard-content">
    <p className="dashboard-eyebrow">MAKE IT YOURS</p>
    <h1>Settings ⚙️</h1>
    <p style={{ color: "#718078" }}>
      Customize your CarbonTrack experience.
    </p>

    <form onSubmit={saveSettings}>
      <section
        className="dashboard-panel"
        style={{ marginTop: 25, padding: 24 }}
      >
        <h2 style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Bell size={21} color="#16a34a" /> Notifications
        </h2>

        <div style={rowStyle}>
          <div>
            <strong>Activity reminders</strong>
            <p style={{ margin: "5px 0 0", color: "#718078", fontSize: 14 }}>
              Enable reminders to log your activities.
            </p>
          </div>
          <Toggle
            label="Activity reminders"
            checked={settings.notifications}
            onChange={(value) => updateSetting("notifications", value)}
          />
        </div>

        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div>
            <strong>Weekly report preference</strong>
            <p style={{ margin: "5px 0 0", color: "#718078", fontSize: 14 }}>
              Enable your weekly summary preference.
            </p>
          </div>
          <Toggle
            label="Weekly report preference"
            checked={settings.weeklyReport}
            onChange={(value) => updateSetting("weeklyReport", value)}
          />
        </div>
      </section>

      <section
        className="dashboard-panel"
        style={{ marginTop: 20, padding: 24 }}>
        <h2 style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Globe size={21} color="#16a34a" /> Preferences
        </h2>

        <div style={rowStyle}>
          <div>
            <strong>Emission units</strong>
            <p style={{ margin: "5px 0 0", color: "#718078", fontSize: 14 }}>
              Choose the unit displayed in your preferences.
            </p>
          </div>

          <select
            value={settings.units}
            onChange={(e) => updateSetting("units", e.target.value)}
            aria-label="Emission units"
            style={{
              padding: 10,
              border: "1px solid #dce5dd",
              borderRadius: 9,
              background: "white",
            }}
          >
            <option value="kg">Kilograms (kg CO₂e)</option>
            <option value="tonnes">Tonnes (t CO₂e)</option>
          </select>
        </div>

        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div>
            <strong style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Moon size={18} /> Dark mode preference
            </strong>
            <p style={{ margin: "5px 0 0", color: "#718078", fontSize: 14 }}>
              Save your preferred appearance setting.
            </p>
          </div>
          <Toggle
            label="Dark mode preference"
            checked={settings.darkMode}
            onChange={(value) => updateSetting("darkMode", value)}
          />
        </div>
      </section>

      <section
        className="dashboard-panel"
        style={{ marginTop: 20, padding: 24 }}
      >
        <h2 style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <ShieldCheck size={21} color="#16a34a" /> Privacy
        </h2>
        <p style={{ color: "#718078", lineHeight: 1.7, fontSize: 14 }}>
          Your current preferences and demo profile are stored in this
          browser using localStorage. They are not synced to a server.
          Clearing browser data may remove them.
        </p>
      </section>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginTop: 22,
          alignItems: "center",
        }}
      >
        <button type="submit" className="activity-submit">
          <Save size={17} /> Save Settings
        </button>

        <button
          type="button"
          onClick={resetSettings}
          style={{
            padding: "11px 16px",
            border: "1px solid #dce5dd",
            borderRadius: 10,
            background: "white",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <RotateCcw size={16} /> Reset
        </button>

        {saved && (
          <span role="status" style={{ color: "#15803d" }}>
            Settings saved!
          </span>
        )}
      </div>
    </form>
  </main>
</div>
);
}
