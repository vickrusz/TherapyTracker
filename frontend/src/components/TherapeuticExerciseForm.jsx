import { useState } from "react";

export default function TherapeuticExerciseForm() {
  const [position, setPosition] = useState("");
  const [exercises, setExercises] = useState("");
  const [repetitions, setRepetitions] = useState("");
  const [resistance, setResistance] = useState("");

  const narrative =
    position && exercises
      ? `Pt performing BLE therapeutic exercises in ${position} including ${exercises}${
          repetitions ? ` x ${repetitions} reps` : ""
        }${
          resistance ? ` with ${resistance} resistance` : ""
        }. Pt requires skilled manual and verbal cueing to improve proper form, muscle activation, and safety, justifying ongoing need for skilled therapy.`
      : "";

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

      <textarea
        value={exercises}
        onChange={(e) => setExercises(e.target.value)}
        placeholder="knee extension, hip flexion, hip abduction"
      />

      <hr />

      <h3>Generated Narrative</h3>
      <p>{narrative}</p>
    </div>
  );
}
