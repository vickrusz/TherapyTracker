import { useState, useEffect } from "react";

export default function TherapeuticActivityForm({ onChange }) {
  const [activity, setActivity] = useState("");
  const [assistLevel, setAssistLevel] = useState("");
  const [numberOfAssist, setNumberOfAssist] = useState("1");
  const [focus, setFocus] = useState("");
  const [repetitions, setRepetitions] = useState("");
  const [minutes, setMinutes] = useState("");

  const activityPhrase = repetitions
    ? `${repetitions} repetitions of ${activity}`
    : activity;

  const assistPhrase =
    numberOfAssist === "2" ? `${assistLevel} x2` : assistLevel;

  const narrative =
    activity && assistLevel
      ? `Pt required skilled PTA intervention to address decreased BLE strength and impaired balance impacting functional mobility and safe transfers. Pt performed ${activityPhrase} requiring ${assistPhrase}${
          focus ? ` focusing on ${focus}` : ""
        }. Skilled verbal/tactile cueing provided to improve proper form, weight shifting, and safety.`
      : "";

  useEffect(() => {
    if (!activity || !assistLevel) {
      return;
    }

    const treatmentData = {
      category: "therAct",
      clinicalDetails: narrative,
      minutes: Number(minutes),
      details: {
        activity,
        assistLevel,
        numberOfAssist,
        repetitions: repetitions ? Number(repetitions) : null,
        focus,
      },
    };

    onChange(treatmentData);
  }, [
    activity,
    assistLevel,
    numberOfAssist,
    repetitions,
    focus,
    minutes,
    narrative,
    onChange,
  ]);

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
      <h2>Therapeutic Activity</h2>
      <label>
        Minutes:
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />
      </label>

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
      <br />
      <br />
      <label>Number of Assist</label>
      <select
        value={numberOfAssist}
        onChange={(e) => setNumberOfAssist(e.target.value)}
      >
        <option value="1">1 person</option>
        <option value="2">2 people</option>
      </select>
      <br />
      <br />
      <label>Repetitions:</label>
      <input
        type="number"
        min="1"
        value={repetitions}
        onChange={(e) => setRepetitions(e.target.value)}
        placeholder="ex: 10"
      />
      <br />
      <br />
      <label>Focus:</label>
      <input
        type="text"
        value={focus}
        onChange={(e) => setFocus(e.target.value)}
        placeholder="leaning forward, pushing from armrests..."
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
