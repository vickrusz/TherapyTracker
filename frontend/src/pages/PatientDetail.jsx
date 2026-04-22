import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPatientById,
  getVisitsByPatient,
  createVisit,
  getInterventionsByVisit,
} from "../services/patientApi";

export default function PatientDetail() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [visitForm, setVisitForm] = useState({
    visitDate: "",
    visitType: "PT",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const patientData = await getPatientById(id);
        setPatient(patientData);

        const visitsData = await getVisitsByPatient(id);

        const visitsWithInterventions = await Promise.all(
          visitsData.map(async (visit) => {
            const interventions = await getInterventionsByVisit(visit.id);

            return {
              ...visit,
              interventions,
            };
          })
        );

        setVisits(visitsWithInterventions);
      } catch (err) {
        console.error(err);
        setError("Could not load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  function handleVisitChange(e) {
    const { name, value } = e.target;

    setVisitForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleVisitSubmit(e) {
    e.preventDefault();

    try {
      const newVisit = await createVisit(id, visitForm);

      setVisits((prev) => [newVisit, ...prev]);

      setVisitForm({
        visitDate: "",
        visitType: "PT",
        notes: "",
      });

      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Could not create visit");
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

      <button type="button" onClick={() => setShowForm((prev) => !prev)}>
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
            <label htmlFor="notes">Notes</label>
            <br />
            <input
              id="notes"
              name="notes"
              type="text"
              value={visitForm.notes}
              onChange={handleVisitChange}
            />
          </div>

          <br />
          <button type="submit">Save Visit</button>
        </form>
      )}

      {visits.length === 0 ? (
        <p>No visits yet.</p>
      ) : (
        <ul>
          {visits.map((visit) => (
            <li key={visit.id} style={{ marginBottom: "1rem" }}>
              <p>{new Date(visit.visitDate).toLocaleDateString()}</p>
              <p>{visit.visitType}</p>

              {visit.interventions && visit.interventions.length > 0 ? (
                <div>
                  <h4>Interventions</h4>
                  {visit.interventions.map((i) => (
                    <div key={i.id}>
                      <p>
                        <strong>{i.category}</strong> — {i.minutes} min
                      </p>
                      <p>{i.clinicalDetails}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No interventions yet.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
