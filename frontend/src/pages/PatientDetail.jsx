import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatientById } from "../services/patientApi";

export default function PatientDetail() {
    const { id } = useParams();

    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadPatient() {
            try {
                const data = await getPatientById(id);
                setPatient(data);
            } catch (err) {
                console.error(err);
                setError("Could not load patient");
            } finally {
                setLoading(false);
            }
        }
        loadPatient();
    }, [id]);
    if (loading) return <p>Loading Patient...</p>
    if (error) return <p>{error}</p>
    if (!patient) return <p>Patient not found</p>

    return (
        <div>
            <h1>{patient.nickname}</h1>
            <p>{patient.fullName}</p>
            <p>
                Eval Date:{" "}
                {new Date(patient.initialEvalDate).toLocaleDateString()}
            </p>

            <p>Status: {patient.status}</p>

            {patient.frequencyNotes && (
            <p>Frequency: {patient.frequencyNotes}</p>
            )}
        </div>
    );

}