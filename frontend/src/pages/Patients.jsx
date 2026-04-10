import { useEffect, useState } from "react";
import { getPatients } from "../services/patientApi";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        setError("Could not load patients");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadPatients();
  }, []);

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Patients</h1>

      {patients.length === 0 ? (
        <p>No patients yet.</p>
      ) : (
        <ul>
          {patients.map((patient) => (
            <li key={patient.id}>
              <strong>{patient.nickname}</strong> — {patient.fullName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}