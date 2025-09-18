-- DropForeignKey
ALTER TABLE "public"."LabResult" DROP CONSTRAINT "LabResult_patientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MedicalHistory" DROP CONSTRAINT "MedicalHistory_patientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Prescription" DROP CONSTRAINT "Prescription_patientId_fkey";

-- AddForeignKey
ALTER TABLE "public"."MedicalHistory" ADD CONSTRAINT "MedicalHistory_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LabResult" ADD CONSTRAINT "LabResult_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prescription" ADD CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
