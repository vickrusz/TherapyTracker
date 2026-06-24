import { useState } from "react";

export default function TherapeuticActivityForm() {
  const [activity, setActivity] = useState("");
  const [assistLevel, setAssistLevel] = useState("");

  return (
    <div>
      <h2>Therapeutic Activity</h2>

      <label>Activity:</label>
      <select value={activity} onChange={(e) => setActivity(e.target.value)}>
        <option value="">Select Activity</option>
        <option value="Sit to stand">Sit to Stand</option>
        <option value="Supine to sit">Supine to Sit</option>
        <option value="Stand Pivot Transfer">Stand Pivot Transfer</option>
        <option value="Rolling">Rolling</option>
        <option value="Floor Recovery">Floor Recovery</option>
        <option value="Other">Other</option>
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

      <hr />

      <p>
        <strong>Activity:</strong>
        {activity}
      </p>
      <p>
        <strong>Assist Level:</strong>
        {assistLevel}
      </p>
    </div>
  );
}
