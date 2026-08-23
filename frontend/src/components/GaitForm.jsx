import { useState } from "react";

export default function GaitForm() {
  const [gaitBouts, setGaitBouts] = useState([
    {
      distances: [""],
      surface: "",
      device: "",
      assistLevel: "",
      seatedRestBreaks: "",
      standingRestBreaks: "",
      details: "",
    },
  ]);

  const [clinicalFocus, setClinicalFocus] = useState([]);

  const deviceOptions = [
    "Rollator",
    "Rolling Walker",
    "Ustep walker",
    "Single Point Cane",
    "Quad cane",
    "No assistive device",
  ];

  const assistOptions = [
    "Independent",
    "Supervision",
    "SBA",
    "CGA/SBA",
    "CGA",
    "min/CGA",
    "min A",
    "min/mod A",
    "mod A",
    "mod/max A",
    "max A",
    "total A",
  ];

  const surfaceOptions = ["level indoor surface", "uneven surface", "other"];

  const clinicalFocusOptions = [
    "step length",
    "foot clearance",
    "heel strike",
    "postural alignment",
    "weight shifting",
    "device management",
    "turning",
    "gait speed",
    "cadence",
    "sequencing",
    "lower extremity advancement",
  ];

  const updateGaitBout = (index, field, value) => {
    setGaitBouts((prev) =>
      prev.map((bout, i) => (i === index ? { ...bout, [field]: value } : bout))
    );
  };

  const updateDistance = (boutIndex, distanceIndex, value) => {
    setGaitBouts((prev) =>
      prev.map((bout, i) => {
        if (i !== boutIndex) return bout;

        const updatedDistances = [...bout.distances];
        updatedDistances[distanceIndex] = value;

        return {
          ...bout,
          distances: updatedDistances,
        };
      })
    );
  };

  const addDistance = (boutIndex) => {
    setGaitBouts((prev) =>
      prev.map((bout, i) =>
        i === boutIndex
          ? {
              ...bout,
              distances: [...bout.distances, ""],
            }
          : bout
      )
    );
  };

  const removeDistance = (boutIndex, distanceIndex) => {
    setGaitBouts((prev) =>
      prev.map((bout, i) =>
        i === boutIndex
          ? {
              ...bout,
              distances: bout.distances.filter((_, j) => j !== distanceIndex),
            }
          : bout
      )
    );
  };

  const addGaitBout = () => {
    setGaitBouts((prev) => [
      ...prev,
      {
        distances: [""],
        surface: "",
        device: "",
        assistLevel: "",
        seatedRestBreaks: "",
        standingRestBreaks: "",
        details: "",
      },
    ]);
  };

  const removeGaitBout = (index) => {
    setGaitBouts((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleClinicalFocus = (focus) => {
    setClinicalFocus((prev) =>
      prev.includes(focus)
        ? prev.filter((item) => item !== focus)
        : [...prev, focus]
    );
  };

  const formatDistances = (distances) => {
    const counts = {};

    distances.forEach((distance) => {
      counts[distance] = (counts[distance] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([distance, count]) =>
        count > 1 ? `${distance} ft x ${count}` : `${distance} ft`
      )
      .join(", ");
  };

  const formatGaitBout = (bout) => {
    const validDistances = bout.distances.filter(Boolean);

    if (validDistances.length === 0) return "";

    const parts = [];

    parts.push(formatDistances(validDistances));

    if (bout.surface) {
      parts.push(`over ${bout.surface}`);
    }

    if (bout.device) {
      parts.push(`with ${bout.device}`);
    }

    if (bout.assistLevel) {
      parts.push(`requiring ${bout.assistLevel}`);
    }

    if (bout.standingRestBreaks) {
      parts.push(
        `${bout.standingRestBreaks} standing rest ${
          bout.standingRestBreaks === "1" ? "break" : "breaks"
        }`
      );
    }

    if (bout.seatedRestBreaks) {
      parts.push(
        `${bout.seatedRestBreaks} seated rest ${
          bout.seatedRestBreaks === "1" ? "break" : "breaks"
        }`
      );
    }

    if (bout.details) {
      parts.push(bout.details);
    }

    return parts.join(", ");
  };

  const gaitNarrative = gaitBouts
    .map(formatGaitBout)
    .filter(Boolean)
    .join("; ");

  const focusNarrative =
    clinicalFocus.length > 0
      ? ` with emphasis on ${clinicalFocus.join(", ")}`
      : "";

  const narrative =
    gaitNarrative.length > 0
      ? `Pt required skilled PTA intervention to address impaired gait mechanics and balance affecting safe functional mobility. Pt participated in gait training including ${gaitNarrative}${focusNarrative}. Skilled verbal/manual cueing provided as needed to improve gait mechanics, movement quality, and safety.`
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

      {gaitBouts.map((bout, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "16px",
          }}
        >
          <h3>Gait Bout {index + 1}</h3>

          <label>Walking Distances</label>

          {bout.distances.map((distance, distanceIndex) => (
            <div key={distanceIndex} style={{ marginBottom: "0.5rem" }}>
              <input
                type="number"
                min="1"
                value={distance}
                onChange={(e) =>
                  updateDistance(index, distanceIndex, e.target.value)
                }
                placeholder="100"
              />

              <span> ft</span>

              {bout.distances.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDistance(index, distanceIndex)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={() => addDistance(index)}>
            + Add Distance
          </button>

          <label>Surface</label>
          <select
            value={bout.surface}
            onChange={(e) => updateGaitBout(index, "surface", e.target.value)}
          >
            <option value="">Select Surface</option>

            {surfaceOptions.map((surface) => (
              <option key={surface} value={surface}>
                {surface}
              </option>
            ))}
          </select>

          <br />
          <br />

          <label>Assistive Device</label>
          <select
            value={bout.device}
            onChange={(e) => updateGaitBout(index, "device", e.target.value)}
          >
            <option value="">Select Device</option>

            {deviceOptions.map((device) => (
              <option key={device} value={device}>
                {device}
              </option>
            ))}
          </select>

          <br />
          <br />

          <label>Assist Level</label>
          <select
            value={bout.assistLevel}
            onChange={(e) =>
              updateGaitBout(index, "assistLevel", e.target.value)
            }
          >
            <option value="">Select Assist Level</option>

            {assistOptions.map((assist) => (
              <option key={assist} value={assist}>
                {assist}
              </option>
            ))}
          </select>

          <br />
          <br />

          <label>Standing Rest Breaks</label>
          <input
            type="number"
            value={bout.standingRestBreaks}
            onChange={(e) =>
              updateGaitBout(index, "standingRestBreaks", e.target.value)
            }
            min="0"
          />

          <br />
          <br />

          <label>Seated Rest Breaks</label>
          <input
            type="number"
            value={bout.seatedRestBreaks}
            onChange={(e) =>
              updateGaitBout(index, "seatedRestBreaks", e.target.value)
            }
            min="0"
          />

          <br />
          <br />

          <label>Details / Gait Quality</label>
          <input
            type="text"
            value={bout.details}
            onChange={(e) => updateGaitBout(index, "details", e.target.value)}
            placeholder="decreased step length, cues for larger steps"
          />

          <br />
          <br />

          {gaitBouts.length > 1 && (
            <button type="button" onClick={() => removeGaitBout(index)}>
              Remove Gait Bout
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={addGaitBout}>
        + Add Gait Bout
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

      <h3>Generated Narrative</h3>
      <p>{narrative}</p>

      <button type="button" onClick={copyNarrative} disabled={!narrative}>
        Copy Narrative
      </button>
    </div>
  );
}
