-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "quickCapture" TEXT,
ADD COLUMN     "responseToTreatment" TEXT,
ADD COLUMN     "totalMinutes" INTEGER;

-- CreateTable
CREATE TABLE "VisitIntervention" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitId" INTEGER NOT NULL,

    CONSTRAINT "VisitIntervention_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VisitIntervention" ADD CONSTRAINT "VisitIntervention_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
