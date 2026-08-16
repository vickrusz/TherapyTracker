import { useState } from "react";

export default function NeuroReedForm() {
  const [activities, setActivities] = useState([
    {
      position: "",
      activity: "",
      support: "",
      assist: "",
      details: "",
    },
  ]);

  const [clinicalFocus, setClinicalFocus] = useState([]);
  const [functionalCarryover, setFunctionalCarryover] = useState([]);

  const positionOptions = ["sitting", "standing"];

  const supportOptions = [
    "no UE support",
    "single UE support",
    "bilateral UE support",
    "handheld assist",
    "bar support",
    "rolling walker support",
    "cane support",
  ];

  const assistOptions = [
    "Independent",
    "Supervision",
    "SBA",
    "CGA",
    "Min A",
    "Mod A",
    "Max A",
  ];

  const clinicalFocusOptions = [
    "weight shifting",
    "midline orientation",
    "postural alignment",
    "trunk control",
    "static balance",
    "dynamic balance",
    "lower extremity advancement",
    "foot clearance",
    "motor control",
  ];

  const functionalCarryoverOptions = [
    "sit-to-stand transfers",
    "pivot transfers",
    "toilet transfers",
    "chair transfers",
    "gait",
    "gait initiation",
    "obstacle negotiation",
    "functional mobility",
  ];

  const updateActivity = (index, field, value) => {
    setActivities((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addActivity = () => {
    setActivities((prev) => [
      ...prev,

      {
        position: "",
        activity: "",
        support: "",
        assist: "",
        details: "",
      },
    ]);
  };

  const removeActivity = (index) => {
    setActivities((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleClinicalFocus = (focus) => {
    setClinicalFocus((prev) =>
      prev.includes(focus)
        ? prev.filter((item) => item !== focus)
        : [...prev, focus]
    );
  };

  const toggleFunctionalCarryover = (item) => {
    setFunctionalCarryover((prev) =>
      prev.includes(item)
        ? prev.filter((value) => value !== item)
        : [...prev, item]
    );
  };

  const formatActivity = (item) => {
    if (!item.activity) return "";

    const parts = [];

    if (item.position) {
      parts.push(`${item.position} ${item.activity}`);
    } else {
      parts.push(item.activity);
    }

    if (item.support) {
      parts.push(`with ${item.support}`);
    }

    if (item.assist) {
      parts.push(`requiring ${item.assist}`);
    }

    if (item.details) {
      parts.push(item.details);
    }

    return parts.join(" ");
  };

  const activityNarrative = activities
    .map(formatActivity)
    .filter(Boolean)
    .join("; ");

  const focusNarrative =
    clinicalFocus.length > 0
      ? ` with emphasis on ${clinicalFocus.join(", ")}`
      : "";

  const carryoverNarrative =
    functionalCarryover.length > 0
      ? ` to improve ${functionalCarryover.join(", ")}`
      : "";

  const narrative =
    activityNarrative.length > 0
      ? `Pt required skilled PTA intervention to address impaired balance and postural control impacting safe functional mobility and ADLs. Pt participated in neuromuscular reeducation activities including ${activityNarrative}${focusNarrative}${carryoverNarrative}. Skilled verbal/manual cueing provided as needed to improve balance reactions, postural control, coordination, movement quality, and safety.`
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

      {activities.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "16px",
          }}
        >
          <h3>Balance Activity {index + 1}</h3>

          <label>Position</label>

          <select
            value={item.position}
            onChange={(e) => updateActivity(index, "position", e.target.value)}
          >
            <option value="">Select Position</option>

            {positionOptions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>

          <br />

          <br />

          <label>Balance Activity</label>

          <input
            type="text"
            value={item.activity}
            onChange={(e) => updateActivity(index, "activity", e.target.value)}
            placeholder="standing on foam, stepping over cane"
          />

          <br />

          <br />

          <label>Support</label>

          <select
            value={item.support}
            onChange={(e) => updateActivity(index, "support", e.target.value)}
          >
            <option value="">Select Support</option>

            {supportOptions.map((support) => (
              <option key={support} value={support}>
                {support}
              </option>
            ))}
          </select>

          <br />

          <br />

          <label>Assist Level</label>

          <select
            value={item.assist}
            onChange={(e) => updateActivity(index, "assist", e.target.value)}
          >
            <option value="">Select Assist</option>

            {assistOptions.map((assist) => (
              <option key={assist} value={assist}>
                {assist}
              </option>
            ))}
          </select>

          <br />

          <br />

          <label>Details</label>

          <input
            type="text"
            value={item.details}
            onChange={(e) => updateActivity(index, "details", e.target.value)}
            placeholder="20 sec, eyes closed, forward/backward stepping"
          />

          <br />
          <br />

          {activities.length > 1 && (
            <button type="button" onClick={() => removeActivity(index)}>
              Remove Activity
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={addActivity}>
        + Add Balance Activity
      </button>

      <hr />

      <h3>Clinical Focus</h3>

      {clinicalFocusOptions.map((focus) => (
        <label key={focus} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={clinicalFocus.includes(focus)}
            onChange={() => toggleClinicalFocus(focus)}
          />

          {focus}
        </label>
      ))}

      <hr />

      <h3>Functional Carryover</h3>

      {functionalCarryoverOptions.map((item) => (
        <label key={item} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={functionalCarryover.includes(item)}
            onChange={() => toggleFunctionalCarryover(item)}
          />

          {item}
        </label>
      ))}

      <hr />

      <h3>Generated Narrative</h3>

      <p>{narrative}</p>

      <button type="button" onClick={copyNarrative} disabled={!narrative}>
        Copy Narrative
      </button>
    </div>
  );
}
