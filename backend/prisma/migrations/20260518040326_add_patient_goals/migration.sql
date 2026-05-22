-- CreateTable
CREATE TABLE "PatientGoal" (
    "id" SERIAL NOT NULL,
    "goalText" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in progress',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patientId" INTEGER NOT NULL,

    CONSTRAINT "PatientGoal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PatientGoal" ADD CONSTRAINT "PatientGoal_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
