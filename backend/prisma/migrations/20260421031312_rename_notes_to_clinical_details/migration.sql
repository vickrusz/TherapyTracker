/*
  Warnings:

  - You are about to drop the column `notes` on the `VisitIntervention` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VisitIntervention" DROP COLUMN "notes",
ADD COLUMN     "clinicalDetails" TEXT;
