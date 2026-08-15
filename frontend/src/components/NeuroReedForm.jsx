import { useState } from "react";

export default function NeuroReedForm() {
  const [position, setPosition] = useState("");
  const [balanceActivity, setBalanceActivity] = useState("");
  const [support, setSupport] = useState("");
  const [details, setDetails] = useState("");

  const narrative =
    position && balanceActivity
      ? `Pt required skilled PTA intervention to address impaired dynamic ${position} balance impacting postural control impacting safe functional mobiliity and ADLs. Balance activities in ${position} including ${balanceActivity} ${
          support ? `with ${support}` : ""
        }${
          details ? `${details}` : ""
        }. Skilled verbal/manual cueing provided to improve balance reactions, postural control, coordination, and safety. `
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
      <h2>Neuromuscular Reeducation</h2>

      <label>Position</label>
      <select value={position} onChange={(e) => setPosition(e.target.value)}>
        <option value="">Select position</option>
        <option value="sitting">Sitting</option>
        <option value="standing">Standing</option>
      </select>

      <br />
      <br />

      <label>Balance Activity</label>
      <input
        type="text"
        value={balanceActivity}
        onChange={(e) => setBalanceActivity(e.target.value)}
        placeholder="standing on foam, sidestepping"
      />

      <br />
      <br />

      <label>Support</label>
      <input
        type="text"
        value={support}
        onChange={(e) => setSupport(e.target.value)}
        placeholder="2 UE support at bar, 1 hand on RW, no UE support"
      />

      <br />
      <br />

      <label>Details</label>
      <input
        type="text"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="eyes open/closed, time standing, direction"
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
