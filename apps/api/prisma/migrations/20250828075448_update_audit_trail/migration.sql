/*
  Warnings:

  - You are about to drop the column `performedBy` on the `AuditTrail` table. All the data in the column will be lost.
  - Added the required column `patientId` to the `AuditTrail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `performedById` to the `AuditTrail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AuditTrail" DROP CONSTRAINT "AuditTrail_labResultId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AuditTrail" DROP CONSTRAINT "AuditTrail_medicalHistoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AuditTrail" DROP CONSTRAINT "AuditTrail_prescriptionId_fkey";

-- AlterTable
ALTER TABLE "public"."AuditTrail" DROP COLUMN "performedBy",
ADD COLUMN     "patientId" TEXT NOT NULL,
ADD COLUMN     "performedById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."HealthData" ADD COLUMN     "source" TEXT;

-- AddForeignKey
ALTER TABLE "public"."AuditTrail" ADD CONSTRAINT "AuditTrail_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditTrail" ADD CONSTRAINT "AuditTrail_medicalHistoryId_fkey" FOREIGN KEY ("medicalHistoryId") REFERENCES "public"."MedicalHistory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."AuditTrail" ADD CONSTRAINT "AuditTrail_labResultId_fkey" FOREIGN KEY ("labResultId") REFERENCES "public"."LabResult"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."AuditTrail" ADD CONSTRAINT "AuditTrail_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "public"."Prescription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
