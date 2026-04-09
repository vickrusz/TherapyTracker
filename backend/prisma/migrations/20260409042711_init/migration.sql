-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "initialEvalDate" TIMESTAMP(3) NOT NULL,
    "frequencyNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);
