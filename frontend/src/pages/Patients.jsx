import { useEffect, useState } from "react";
import { getPatients } from "../services/patientApi";
import { Link } from "react-router-dom";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await getPatients();
        setPatients(data);
        console.log("Patients loaded:", data);
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
            <div
              key={patient.id}
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "8px",
                backgroundColor: "#fafafa",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                {patient.nickname}
              </div>

              <div style={{ color: "#555" }}>{patient.fullName}</div>

              <Link to={`/patients/${patient.id}`}>
                <button type="button">View Details</button>
              </Link>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}
