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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
