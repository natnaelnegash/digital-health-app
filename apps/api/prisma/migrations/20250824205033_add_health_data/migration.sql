/*
  Warnings:

  - You are about to drop the column `glucose` on the `HealthData` table. All the data in the column will be lost.
  - You are about to drop the column `heartRate` on the `HealthData` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `HealthData` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `HealthData` table. All the data in the column will be lost.
  - Added the required column `date` to the `HealthData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `HealthData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `HealthData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `HealthData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `HealthData` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."HealthData" DROP CONSTRAINT "HealthData_patientId_fkey";

-- AlterTable
ALTER TABLE "public"."HealthData" DROP COLUMN "glucose",
DROP COLUMN "heartRate",
DROP COLUMN "patientId",
DROP COLUMN "timestamp",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "value" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "public"."FitbitToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FitbitToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FitbitToken_userId_key" ON "public"."FitbitToken"("userId");

-- AddForeignKey
ALTER TABLE "public"."HealthData" ADD CONSTRAINT "HealthData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FitbitToken" ADD CONSTRAINT "FitbitToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
