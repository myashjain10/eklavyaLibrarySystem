/*
  Warnings:

  - You are about to drop the column `end_time` on the `allotment` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `allotment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "allotment" DROP COLUMN "end_time",
DROP COLUMN "start_time",
ADD COLUMN     "first_half" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "second_half" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "full_day" SET DEFAULT true;
