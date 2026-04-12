const API_BASE_URL = "http://localhost:5000/api";

// This is for the GET request
export async function getPatients() {
  const response = await fetch(`${API_BASE_URL}/patients`);

  if (!response.ok) {
    throw new Error("Failed to fetch patients");
  }

  return response.json();
}

// This is for the POST request
export async function createPatient(patientData) {
  const response = await fetch(`${API_BASE_URL}/patients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patientData),
  });
  if (!response.ok) {
    throw new Error("Failed to create patient");
  }

  return response.json();
}
