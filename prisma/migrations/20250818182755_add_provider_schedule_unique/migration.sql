/*
  Warnings:

  - A unique constraint covering the columns `[provider_id,day_of_week]` on the table `provider_schedules` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `provider_schedules_provider_id_day_of_week_key` ON `provider_schedules`(`provider_id`, `day_of_week`);
