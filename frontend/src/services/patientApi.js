const API_BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

// This is for the GET request many patients
export async function getPatients() {
  const response = await fetch(`${API_BASE_URL}/patients`);

  if (!response.ok) {
    throw new Error("Failed to fetch patients");
  }

  return response.json();
}

// This is for the POST request to create a patient
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

// This is for getting one patient at a time
export async function getPatientById(id) {
  const response = await fetch(`http://localhost:5000/api/patients/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch patient");
  }
  return response.json();
}

// This is to retrieve a patient's visits
export async function getVisitsByPatient(id) {
  const response = await fetch(
    `http://localhost:5000/api/patients/${id}/visits`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch visits");
  }

  return response.json();
}

// This is to create a visit for a patient
export async function createVisit(patientId, visitData) {
  const response = await fetch(
    `http://localhost:5000/api/patients/${patientId}/visits`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(visitData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create visit");
  }
  return response.json();
}

// Get goals of a patient
export async function getGoalsByPatient(patientId) {
  const response = await fetch(`${API_BASE_URL}/patients/${patientId}/goals`);

  if (!response.ok) {
    throw new Error("Failed to fetch goals");
  }

  return response.json();
}

// Create the goals of the patient
export async function createGoal(patientId, goalData) {
  const response = await fetch(`${API_BASE_URL}/patients/${patientId}/goals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(goalData),
  });

  if (!response.ok) {
    throw new Error("Failed to create goal");
  }

  return response.json();
}

// Update the goals of a patient
export async function updateGoal(goalId, goalData) {
  const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(goalData),
  });

  if (!response.ok) {
    throw new Error("Failed to update goal");
  }

  return response.json();
}

// Get the interventions from the visit
export async function getInterventionsByVisit(visitId) {
  const res = await fetch(
    `http://localhost:5000/api/visits/${visitId}/interventions`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch interventions");
  }

  return res.json();
}

// Creating new interventions and save in a visit
export async function createIntervention(visitId, data) {
  const res = await fetch(
    `http://localhost:5000/api/visits/${visitId}/interventions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to create intervention");
  }

  return res.json();
}
// update a patient's information
export async function updatePatient(id, patientData) {
  const response = await fetch(`http://localhost:5000/api/patients/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patientData),
  });

  if (!response.ok) {
    throw new Error("Failed to update patient");
  }

  return response.json();
}

// Update the intervention of a patient's visit
export async function updateIntervention(interventionId, data) {
  const response = await fetch(
    `http://localhost:5000/api/interventions/${interventionId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update intervention");
  }

  return response.json();
}

// This deletes an intervention from a patient
export async function deleteIntervention(interventionId) {
  const response = await fetch(
    `http://localhost:5000/api/interventions/${interventionId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete intervention");
  }

  return response.json();
}
