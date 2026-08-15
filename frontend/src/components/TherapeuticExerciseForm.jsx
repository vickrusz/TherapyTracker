import { useState } from "react";

export default function TherapeuticExerciseForm() {
  const [groups, setGroups] = useState({
    supine: [],
    sidelying: [],
    prone: [],
    sitting: [],
    standing: [],
  });

  const [repetitions, setRepetitions] = useState("");
  const [resistance, setResistance] = useState("");

  const exerciseGroups = {
    supine: [
      "heel slides",
      "SLR",
      "bridging",
      "scooting",
      "TKE",
      "quad sets",
      "glute sets",
      "ankle pumps",
    ],

    sidelying: ["hip abduction", "clamshell", "hip adduction"],

    prone: ["prone on elbows", "hip extension", "hamstring curls"],

    sitting: [
      "knee extension",
      "hip flexion",
      "hip abduction",
      "ankle pumps",
      "marching",
    ],

    standing: [
      "hip flexion",
      "hip abduction",
      "hip extension",
      "marching",
      "heel raises",
      "mini squats",
    ],
  };

  const toggleExercise = (group, exercise) => {
    setGroups((prev) => {
      const selectedExercises = prev[group];

      return {
        ...prev,

        [group]: selectedExercises.includes(exercise)
          ? selectedExercises.filter((e) => e !== exercise)
          : [...selectedExercises, exercise],
      };
    });
  };

  const narrativeParts = Object.entries(groups)

    .filter(([, exercises]) => exercises.length > 0)
    .map(([group, exercises]) =>
      exercises.map((exercise) => `${group} ${exercise}`).join(", ")
    );

  const narrative =
    narrativeParts.length > 0
      ? `Pt performed BLE therapeutic exercises including ${narrativeParts.join(
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

      {Object.entries(exerciseGroups).map(([group, exerciseOptions]) => (
        <div key={group}>
          <h4>{group}</h4>

          {exerciseOptions.map((exercise) => (
            <label key={`${group}-${exercise}`} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={groups[group].includes(exercise)}
                onChange={() => toggleExercise(group, exercise)}
              />

              {exercise}
            </label>
          ))}
        </div>
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
