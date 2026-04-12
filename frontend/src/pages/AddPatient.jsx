import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPatient } from "../services/patientApi";

export default function AddPatient() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
      nickname: "",
      fullName: "",
      initialEvalDate: "",
      frequencyNotes: "",
      status: "active",
    });
    const [error, setError] = useState("");

    function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await createPatient(formData);
      navigate("/patients");
    } catch (err) {
      console.error(err);
      setError("Could not create patient");
    }
  }
  return (
    <div>
      <h1>Add Patient</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nickname">Nickname</label>
          <br />
          <input
            id="nickname"
            name="nickname"
            type="text"
            value={formData.nickname}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="fullName">Full Name</label>
          <br />
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="initialEvalDate">Initial Eval Date</label>
          <br />
          <input
            id="initialEvalDate"
            name="initialEvalDate"
            type="date"
            value={formData.initialEvalDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="frequencyNotes">Frequency Notes</label>
          <br />
          <input
            id="frequencyNotes"
            name="frequencyNotes"
            type="text"
            value={formData.frequencyNotes}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <br />
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <br />

        <button type="submit">Save Patient</button>
      </form>
    </div>
  );
}
  