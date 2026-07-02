import { useState } from "react";

export default function TherapeuticExerciseForm() {
  const [position, setPosition] = useState("");
  const [exercises, setExercises] = useState([]);
  const [repetitions, setRepetitions] = useState("");
  const [resistance, setResistance] = useState("");
  const exerciseOptions = [
    "knee extension",
    "hip flexion",
    "hip abduction",
    "hip extension",
    "ankle pumps",
    "marching",
  ];

  const toggleExercise = (exercise) => {
    setExercises((prev) =>
      prev.includes(exercise)
        ? prev.filter((e) => e !== exercise)
        : [...prev, exercise]
    );
  };

  const narrative =
    position && exercises
      ? `Pt performing BLE therapeutic exercises in ${position} including ${exercises.join(
          ", "
        )}${repetitions ? ` x ${repetitions} reps` : ""}${
          resistance ? ` with ${resistance} resistance` : ""
        }. Pt requires skilled manual and verbal cueing to improve proper form, muscle activation, and safety, justifying ongoing need for skilled therapy.`
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
      <h2>Therapeutic Exercise</h2>

      <label>Position</label>
      <select value={position} onChange={(e) => setPosition(e.target.value)}>
        <option value="">Select Position</option>
        <option value="supine">Supine</option>
        <option value="sitting">Sitting</option>
        <option value="standing">Standing</option>
      </select>

      <br />
      <br />

      <label>Repetitions</label>

      <input
        type="number"
        value={repetitions}
        onChange={(e) => setRepetitions(e.target.value)}
      />

      <br />
      <br />

      <label>Resistance</label>

      <input
        type="text"
        value={resistance}
        onChange={(e) => setResistance(e.target.value)}
        placeholder="1.5 lb"
      />

      <br />
      <br />

      <h3>Exercises</h3>

      {exerciseOptions.map((exercise) => (
        <label key={exercise} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={exercises.includes(exercise)}
            onChange={() => toggleExercise(exercise)}
          />
          {exercise}
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
