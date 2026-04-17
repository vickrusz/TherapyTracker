import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatientById } from "../services/patientApi";
import { getVisitsByPatient } from "../services/patientApi";

export default function PatientDetail() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const patientData = await getPatientById(id);
        setPatient(patientData);

        const visitsData = await getVisitsByPatient(id);
        setVisits(visitsData);
      } catch (err) {
        console.error(err);
        setError("Could not load data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

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

      {visits.length === 0 ? (
        <p>No visits yet.</p>
      ) : (
        <ul>
          {visits.map((visit) => (
            <li key={visit.id}>
              {new Date(visit.visitDate).toLocaleDateString()} —{" "}
              {visit.visitType}
              {visit.notes && ` (${visit.notes})`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
