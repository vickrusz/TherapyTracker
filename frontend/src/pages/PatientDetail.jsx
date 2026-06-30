import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPatientById,
  getVisitsByPatient,
  createVisit,
  deleteVisit,
  createIntervention,
  createGoal,
  updatePatient,
  updateIntervention,
  updateGoal,
  deleteIntervention,
  getGoalsByPatient,
  deleteGoal,
} from "../services/patientApi";
import TherapeuticActivityForm from "../components/TherapeuticActivityForm";
import TherapeuticExerciseForm from "../components/TherapeuticExerciseForm";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

// Patient Detail page displays a single patient, and loads the visits and interventions for that patient
// Supports fast visit capture and adding treatment sections from the UI

export default function PatientDetail() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showInterventionForm, setShowInterventionForm] = useState(null);
  const [interventionForm, setInterventionForm] = useState({
    category: "gait",
    minutes: "",
    clinicalDetails: "",
  });
  const [editingInterventionId, setEditingInterventionId] = useState(null);
  const [editInterventionForm, setEditInterventionForm] = useState({
    category: "gait",
    minutes: "",
    clinicalDetails: "",
  });
  const [goals, setGoals] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalForm, setGoalForm] = useState({
    goalText: "",
    status: "in progress",
  });
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editGoalForm, setEditGoalForm] = useState({
    goalText: "",
    status: "in progress",
  });
  const [visitForm, setVisitForm] = useState({
    visitDate: getTodayDate(),
    visitType: "PT",
    quickCapture: "",
  });
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [patientForm, setPatientForm] = useState({
    nickname: "",
    fullName: "",
    initialEvalDate: "",
    frequencyNotes: "",
    status: "active",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function startEditingIntervention(intervention) {
    setEditingInterventionId(intervention.id);

    setEditInterventionForm({
      category: intervention.category,
      minutes: intervention.minutes,
      clinicalDetails: intervention.clinicalDetails || "",
    });
  }

  // Load patient details, and that patient's visits.
  // The visits API returns nested interventions/treatment sections.

  useEffect(() => {
    async function loadData() {
      try {
        const patientData = await getPatientById(id);
        setPatient(patientData);
        setPatientForm({
          nickname: patientData.nickname,
          fullName: patientData.fullName,
          initialEvalDate: new Date(patientData.initialEvalDate)
            .toISOString()
            .split("T")[0],
          frequencyNotes: patientData.frequencyNotes || "",
          status: patientData.status || "active",
        });

        const visitsData = await getVisitsByPatient(id);
        setVisits(visitsData);
        const goalsData = await getGoalsByPatient(id);
        setGoals(goalsData);
      } catch (err) {
        console.error(err);
        setError("Could not load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // Checking for a change in editing the patient
  function handlePatientChange(e) {
    const { name, value } = e.target;

    setPatientForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handlePatientSubmit(e) {
    e.preventDefault();

    try {
      const updatedPatient = await updatePatient(id, patientForm);
      setPatient(updatedPatient);
      setIsEditingPatient(false);
    } catch (err) {
      console.error(err);
      setError("Could not update patient");
    }
  }

  // Goal handlers
  console.log("goals:", goals);

  function handleGoalChange(e) {
    const { name, value } = e.target;

    setGoalForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleGoalSubmit(e) {
    e.preventDefault();

    try {
      const newGoal = await createGoal(id, goalForm);

      setGoals((prev) => [newGoal, ...prev]);
      setGoalForm({
        goalText: "",
        status: "in progress",
      });

      setShowGoalForm(false);
    } catch (err) {
      console.error(err);
      setError("Could not create goal");
    }
  }
  // The function to be able to Edit goals

  function startEditingGoal(goal) {
    setEditingGoalId(goal.id);

    setEditGoalForm({
      goalText: goal.goalText,
      status: goal.status || "in progress",
    });
  }

  function handleEditGoalChange(e) {
    const { name, value } = e.target;

    setEditGoalForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleEditGoalSubmit(e, goalId) {
    e.preventDefault();

    try {
      const updatedGoal = await updateGoal(goalId, editGoalForm);
      console.log("updatedGoal from API:", updatedGoal);

      setGoals((prev) =>
        prev.map((goal) => (goal.id === goalId ? updatedGoal : goal))
      );

      setEditingGoalId(null);
    } catch (err) {
      console.error(err);
      setError("Could not update goal");
    }
  }

  // Update controlled inuts in the Add Visits form
  function handleVisitChange(e) {
    const { name, value } = e.target;

    setVisitForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Create a visit, add it to the top of the UI without refreshing
  async function handleVisitSubmit(e) {
    e.preventDefault();

    try {
      const newVisit = await createVisit(id, visitForm);

      setVisits((prev) => [newVisit, ...prev]);

      setVisitForm({
        visitDate: getTodayDate(), // defaults to today
        visitType: "PT",
        quickCapture: "",
      });

      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Could not create visit");
    }
  }

  async function handleDeleteVisit(visit) {
    const visitDate = new Date(visit.visitDate).toLocaleDateString();
    const confirmed = window.confirm(
      `Delete the ${visit.visitType} visit from ${visitDate}? This will also delete its treatment sections.`
    );

    if (!confirmed) return;

    try {
      await deleteVisit(visit.id);
      setVisits((prev) => prev.filter((item) => item.id !== visit.id));

      if (showInterventionForm === visit.id) {
        setShowInterventionForm(null);
      }
    } catch (err) {
      console.error(err);
      setError("Could not delete visit");
    }
  }

  // intervention handlers, changes in the Add treatment section form
  function handleInterventionChange(e) {
    const { name, value } = e.target;

    setInterventionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Create a treatment section for one visit.
  // Only the matching visit is updtated in state.
  async function handleInterventionSubmit(e, visitId) {
    e.preventDefault();

    try {
      const newIntervention = await createIntervention(
        visitId,
        interventionForm
      );

      setVisits((prev) =>
        prev.map((visit) =>
          visit.id === visitId
            ? {
                ...visit,
                interventions: [
                  newIntervention,
                  ...(visit.interventions || []),
                ],
              }
            : visit
        )
      );

      setInterventionForm({
        category: "gait",
        minutes: "",
        clinicalDetails: "",
      });

      setShowInterventionForm(null);
    } catch (err) {
      console.error(err);
      setError("Could not create intervention");
    }
  }

  function handleEditInterventionChange(e) {
    const { name, value } = e.target;

    setEditInterventionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleEditInterventionSubmit(e, visitId, interventionId) {
    e.preventDefault();

    try {
      const updatedIntervention = await updateIntervention(
        interventionId,
        editInterventionForm
      );

      setVisits((prev) =>
        prev.map((visit) =>
          visit.id === visitId
            ? {
                ...visit,
                interventions: visit.interventions.map((i) =>
                  i.id === interventionId ? updatedIntervention : i
                ),
              }
            : visit
        )
      );

      setEditingInterventionId(null);
    } catch (err) {
      console.error(err);
      setError("Could not update intervention");
    }
  }

  // Delete the intervention
  async function handleDeleteIntervention(visitId, interventionId) {
    try {
      await deleteIntervention(interventionId);

      setVisits((prev) =>
        prev.map((visit) =>
          visit.id === visitId
            ? {
                ...visit,
                interventions: visit.interventions.filter(
                  (i) => i.id !== interventionId
                ),
              }
            : visit
        )
      );
    } catch (err) {
      console.error(err);
      setError("Could not delete intervention");
    }
  }

  async function handleDeleteGoal(goalId) {
    try {
      await deleteGoal(goalId);

      setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
    } catch (err) {
      console.error(err);
      setError("Could not delete goal");
    }
  }

  if (loading) return <p>Loading Patient...</p>;
  if (error) return <p>{error}</p>;
  if (!patient) return <p>Patient not found</p>;

  return (
    <div>
      {isEditingPatient ? (
        <form onSubmit={handlePatientSubmit} style={{ marginBottom: "1rem" }}>
          <div>
            <label>Nickname</label>
            <br />
            <input
              name="nickname"
              value={patientForm.nickname}
              onChange={handlePatientChange}
              required
            />
          </div>
          <div>
            <label>Full Name</label>
            <br />
            <input
              name="fullName"
              value={patientForm.fullName}
              onChange={handlePatientChange}
              required
            />
          </div>
          <div>
            <label>Eval Date</label>
            <br />
            <input
              name="initialEvalDate"
              type="date"
              value={patientForm.initialEvalDate}
              onChange={handlePatientChange}
              required
            />
          </div>

          <div>
            <label>Frequency</label>
            <br />
            <input
              name="frequencyNotes"
              value={patientForm.frequencyNotes}
              onChange={handlePatientChange}
            />
          </div>

          <div>
            <label>Status</label>
            <br />
            <select
              name="status"
              value={patientForm.status}
              onChange={handlePatientChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <br />

          <button type="submit">Save Patient</button>
          <button type="button" onClick={() => setIsEditingPatient(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div style={{ marginBottom: "1rem" }}>
          <h1>{patient.nickname}</h1>
          <p>{patient.fullName}</p>
          <p>
            Eval Date: {new Date(patient.initialEvalDate).toLocaleDateString()}
          </p>
          <p>Status: {patient.status}</p>
          {patient.frequencyNotes && <p>Frequency: {patient.frequencyNotes}</p>}

          <button type="button" onClick={() => setIsEditingPatient(true)}>
            Edit Patient
          </button>
        </div>
      )}

      <h2>Goals</h2>

      <button type="button" onClick={() => setShowGoalForm((prev) => !prev)}>
        {showGoalForm ? "Cancel" : "+ Add Goal"}
      </button>

      {showGoalForm && (
        <form onSubmit={handleGoalSubmit} style={{ marginTop: "1rem" }}>
          <div>
            <label>Goal</label>
            <br />
            <textarea
              name="goalText"
              value={goalForm.goalText}
              onChange={handleGoalChange}
              rows={3}
              style={{ width: "100%" }}
              placeholder="Pt will perform sit to stand transfers with SBA..."
              required
            />
          </div>

          <div>
            <label>Status</label>
            <br />
            <select
              name="status"
              value={goalForm.status}
              onChange={handleGoalChange}
            >
              <option value="in progress">In Progress</option>
              <option value="met">Met</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>

          <br />
          <button type="submit">Save Goal</button>
        </form>
      )}

      {goals.length === 0 ? (
        <p>No goals yet.</p>
      ) : (
        <ul>
          {goals.map((goal) => (
            <li key={goal.id} style={{ marginBottom: "0.75rem" }}>
              {editingGoalId === goal.id ? (
                <form onSubmit={(e) => handleEditGoalSubmit(e, goal.id)}>
                  <textarea
                    name="goalText"
                    value={editGoalForm.goalText}
                    onChange={handleEditGoalChange}
                    rows={3}
                    style={{ width: "100%" }}
                    required
                  />

                  <select
                    name="status"
                    value={editGoalForm.status}
                    onChange={handleEditGoalChange}
                  >
                    <option value="in progress">In Progress</option>
                    <option value="met">Met</option>
                    <option value="discontinued">Discontinued</option>
                  </select>

                  <br />

                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingGoalId(null)}>
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <strong>{goal.status}:</strong> {goal.goalText}
                  <br />
                  <button type="button" onClick={() => startEditingGoal(goal)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <h2>Visits</h2>

      <button
        type="button"
        onClick={() => setShowForm((prev) => !prev)}
        style={{ marginBottom: "1rem" }}
      >
        {showForm ? "Cancel" : "+ Add Visit"}
      </button>
      {showForm && (
        <form
          onSubmit={handleVisitSubmit}
          style={{ marginTop: "1rem", marginBottom: "1rem" }}
        >
          <div>
            <label htmlFor="visitDate">Visit Date</label>
            <br />
            <input
              id="visitDate"
              name="visitDate"
              type="date"
              value={visitForm.visitDate}
              onChange={handleVisitChange}
              required
            />
          </div>

          <div>
            <label htmlFor="visitType">Visit Type</label>
            <br />
            <select
              id="visitType"
              name="visitType"
              value={visitForm.visitType}
              onChange={handleVisitChange}
            >
              <option value="PT">PT</option>
              <option value="PTA">PTA</option>
            </select>
          </div>

          <div>
            <label htmlFor="quickCapture">Quick Capture</label>
            <br />
            <textarea
              id="quickCapture"
              name="quickCapture"
              value={visitForm.quickCapture}
              onChange={handleVisitChange}
              placeholder="TT, BT, GT... BLETE 2# sit/st..."
              rows={3}
              style={{ width: "100%" }}
            />
          </div>

          <TherapeuticActivityForm />
          <TherapeuticExerciseForm />

          <br />
          <button type="submit">Save Visit</button>
        </form>
      )}
      {visits.length === 0 ? (
        <p>No visits yet.</p>
      ) : (
        <div>
          {visits.map((visit) => (
            <div
              key={visit.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <h3 style={{ marginTop: 0 }}>
                  {new Date(visit.visitDate).toLocaleDateString()} -{" "}
                  {visit.visitType}
                </h3>

                <button
                  type="button"
                  onClick={() => handleDeleteVisit(visit)}
                  style={{ marginBottom: "1rem" }}
                >
                  Delete Visit
                </button>
              </div>

              {visit.quickCapture && (
                <p>
                  <strong>Quick Capture:</strong> {visit.quickCapture}
                </p>
              )}

              <button
                type="button"
                onClick={() =>
                  setShowInterventionForm((prev) =>
                    prev === visit.id ? null : visit.id
                  )
                }
              >
                {showInterventionForm === visit.id
                  ? "Cancel"
                  : "+ Add Treatment Section"}
              </button>

              {showInterventionForm === visit.id && (
                <form
                  onSubmit={(e) => handleInterventionSubmit(e, visit.id)}
                  style={{ marginTop: "0.75rem", marginBottom: "1rem" }}
                >
                  <div>
                    <label>Category</label>
                    <br />
                    <select
                      name="category"
                      value={interventionForm.category}
                      onChange={handleInterventionChange}
                    >
                      <option value="gait">Gait</option>
                      <option value="therEx">Ther Ex</option>
                      <option value="therAct">Ther Act</option>
                      <option value="neuroReed">Neuro Reed</option>
                    </select>
                  </div>

                  <div>
                    <label>Minutes</label>
                    <br />
                    <input
                      name="minutes"
                      type="number"
                      value={interventionForm.minutes}
                      onChange={handleInterventionChange}
                      required
                    />
                  </div>

                  <div>
                    <label>Clinical Details</label>
                    <br />
                    <input
                      name="clinicalDetails"
                      type="text"
                      value={interventionForm.clinicalDetails}
                      onChange={handleInterventionChange}
                    />
                  </div>

                  <br />
                  <button type="submit">Save Treatment Section</button>
                </form>
              )}

              <h4>Treatment Sections</h4>

              {visit.interventions && visit.interventions.length > 0 ? (
                <div>
                  {visit.interventions.map((i) => (
                    <div
                      key={i.id}
                      style={{
                        paddingLeft: "0.75rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {editingInterventionId === i.id ? (
                        <form
                          onSubmit={(e) =>
                            handleEditInterventionSubmit(e, visit.id, i.id)
                          }
                        >
                          <select
                            name="category"
                            value={editInterventionForm.category}
                            onChange={handleEditInterventionChange}
                          >
                            <option value="gait">Gait</option>
                            <option value="therEx">Ther Ex</option>
                            <option value="therAct">Ther Act</option>
                            <option value="neuroReed">Neuro Reed</option>
                          </select>

                          <input
                            name="minutes"
                            type="number"
                            value={editInterventionForm.minutes}
                            onChange={handleEditInterventionChange}
                            required
                          />

                          <textarea
                            name="clinicalDetails"
                            value={editInterventionForm.clinicalDetails}
                            onChange={handleEditInterventionChange}
                            rows={4}
                            style={{ width: "100%" }}
                          />

                          <button type="submit">Save</button>

                          <button
                            type="button"
                            onClick={() => setEditingInterventionId(null)}
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <>
                          <p style={{ margin: 0 }}>
                            <strong>{i.category}</strong> — {i.minutes} min
                          </p>

                          <p style={{ margin: 0 }}>{i.clinicalDetails}</p>

                          <button
                            type="button"
                            onClick={() => startEditingIntervention(i)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteIntervention(visit.id, i.id)
                            }
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p> No treatment sections yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
