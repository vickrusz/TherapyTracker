const express = require("express");
const cors = require("cors");
const prisma = require("./prisma/client");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running" });
});

// This is to get all the patients onto the patients page
app.get("/api/patients", async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(patients);
  } catch (error) {
    console.error("Error fetching patinets:", error);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});

// We need a route to get one patient's detail or information.
app.get("/api/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await prisma.patient.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {}
});

app.get("/api/patients/:id/visits", async (req, res) => {
  try {
    const { id } = req.params;

    const visits = await prisma.visit.findMany({
      where: {
        patientId: Number(id),
      },
      orderBy: {
        visitDate: "desc",
      },
    });

    res.json(visits);
  } catch (error) {
    console.error("Error fetching visits:", error);
    res.status(500).json({ error: "Failed to fetch visits" });
  }
});

// This is to create a new patient
app.post("/api/patients", async (req, res) => {
  try {
    const { nickname, fullName, initialEvalDate, frequencyNotes, status } =
      req.body;

    if (!nickname || !fullName || !initialEvalDate) {
      return res.status(400).json({
        error: "nickname, fullName, and initialEvalDate are required",
      });
    }

    const newPatient = await prisma.patient.create({
      data: {
        nickname,
        fullName,
        initialEvalDate: new Date(initialEvalDate),
        frequencyNotes: frequencyNotes || null,
        status: status || "active",
      },
    });

    res.status(201).json(newPatient);
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ error: "Failed to create patient" });
  }
});

// This is to add a Visit to an existing patient
app.post("/api/patients/:id/visits", async (req, res) => {
  try {
    const { id } = req.params;
    const { visitDate, visitType, notes } = req.body;

    if (!visitDate || !visitType) {
      return res.status(400).json({
        error: "visitDate and visitType are required",
      });
    }

    const newVisit = await prisma.visit.create({
      data: {
        visitDate: new Date(visitDate),
        visitType,
        notes: notes || null,
        patientId: Number(id),
      },
    });

    res.status(201).json(newVisit);
  } catch (error) {
    console.error("Error creating visit:", error);
    res.status(500).json({ error: "Failed to create visit" });
  }
});

// GET the interventions (ther ex, ther act, neuro reed or gait) from the visit
app.get("/api/visits/:visitId/interventions", async (req, res) => {
  try {
    const { visitId } = req.params;

    const interventions = await prisma.visitIntervention.findMany({
      where: {
        visitId: Number(visitId),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(interventions);
  } catch (error) {
    console.error("Error fetching interventions:", error);
    res.status(500).json({ error: "Failed to fetch interventions" });
  }
});

// Create an intervention for a visit
app.post("/api/visits/:visitId/interventions", async (req, res) => {
  try {
    const { visitId } = req.params;
    const { category, minutes, clinicalDetails } = req.body;

    if (!category || !minutes) {
      return res.status(400).json({
        error: "category and minutes are required",
      });
    }

    const newIntervention = await prisma.visitIntervention.create({
      data: {
        category,
        minutes: Number(minutes),
        clinicalDetails: clinicalDetails || null,
        visitId: Number(visitId),
      },
    });

    res.status(201).json(newIntervention);
  } catch (error) {
    console.error("Error creating intervention:", error);
    res.status(500).json({ error: "Failed to create intervention" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
