import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPatientById,
  getVisitsByPatient,
  createVisit,
  createIntervention,
} from "../services/patientApi";

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
  const [visitForm, setVisitForm] = useState({
    visitDate: getTodayDate(),
    visitType: "PT",
    quickCapture: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load patient details, and that patient's visits.
  // The visits API returns nested interventions/treatment sections.

  useEffect(() => {
    async function loadData() {
      try {
        const patientData = await getPatientById(id);
        setPatient(patientData);

        const visitsData = await getVisitsByPatient(id);
        setVisits(visitsData);
      } catch (err) {
        console.error(err);
        setError("Co uld not load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

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

  if (loading) return <p>Loading Patient...</p>;
  if (error) return <p>{error}</p>;
  if (!patient) return <p>Patient not found</p>;

  return (
    <div>
      <h1>{patient.nickname}</h1>
      <p>{patient.fullName}</p>
      <p>Eval Date: {new Date(patient.initialEvalDate).toLocaleDateString()}</p>
      <p>Status: {patient.status}</p>
      {patient.frequencyNotes && <p>Frequency: {patient.frequencyNotes}</p>}
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
              <h3 style={{ marginTop: 0 }}>
                {new Date(visit.visitDate).toLocaleDateString()} -{" "}
                {visit.visitType}
              </h3>

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
                      <p style={{ margin: 0 }}>
                        <strong>{i.category}</strong> — {i.minutes} min
                      </p>
                      <p style={{ margin: 0 }}>{i.clinicalDetails}</p>
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
