import { useState } from "react";

export default function GaitForm() {
  const [device, setDevice] = useState("");
  const [assistLevel, setAssistLevel] = useState("");
  const [distance, setDistance] = useState("");
  const [gaitQuality, setGaitQuality] = useState("");

  const narrative =
    device && assistLevel && distance
      ? `Pt required skilled PTA intervention to address impaired gait mechanics and balance affecting safe gait. Pt ambulating ${distance} ft with ${device} requiring ${assistLevel}${
          gaitQuality ? ` with ${gaitQuality}` : ""
        }. Skilled verbal/manual cueing provided to improve step length, posture, sequencing, cadence, heel strike, and safety during gait.`
      : "";

  const copyNarrative = async () => {
    try {
      await navigator.clipboard.writeText(narrative);
      alert("Narrative copied!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div>
      <h2>Gait Training</h2>

      <label>Assistive Device</label>
      <select value={device} onChange={(e) => setDevice(e.target.value)}>
        <option value="">Select device</option>
        <option value="Rollator">Rollator</option>
        <option value="Rolling Walker">Rolling Walker</option>
        <option value="Ustep walker">Ustep walker</option>
        <option value="Single Point Cane">Ustep walker</option>
        <option value="No assistive device">No assistive device</option>
      </select>

      <br />
      <br />

      <label>Assist Level:</label>
      <select
        value={assistLevel}
        onChange={(e) => setAssistLevel(e.target.value)}
      >
        <option value="">Select Assist Level</option>
        <option value="Independent">Independent</option>
        <option value="Supervision">Supervision</option>
        <option value="SBA">SBA</option>
        <option value="CGA/SBA">CGA/SBA</option>
        <option value="CGA">CGA</option>
        <option value="min/CGA">min/CGA</option>
        <option value="min A">min A</option>
        <option value="min/mod A">min/mod A</option>
        <option value="mod A">mod A</option>
        <option value="mod/max A">mod/max A</option>
        <option value="max A">max A</option>
        <option value="total A">total A</option>
      </select>

      <br />
      <br />

      <label>Distance (ft)</label>
      <input
        type="number"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        placeholder="150"
      />

      <br />
      <br />

      <label>Gait Quality</label>
      <input
        type="text"
        value={gaitQuality}
        onChange={(e) => setGaitQuality(e.target.value)}
        placeholder="decreased step length, decreased heel strike"
      />

      <hr />

      <h3>Generated Narrative</h3>
      <p>{narrative}</p>

      <button type="button" onClick={copyNarrative} disabled={!narrative}>
        Copy Narrative
      </button>
    </div>
  );
}
