/*
  Warnings:

  - You are about to drop the column `allotment_id_1` on the `seat` table. All the data in the column will be lost.
  - You are about to drop the column `allotment_id_2` on the `seat` table. All the data in the column will be lost.
  - You are about to drop the column `allotted_1` on the `seat` table. All the data in the column will be lost.
  - You are about to drop the column `allotted_2` on the `seat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "seat" DROP COLUMN "allotment_id_1",
DROP COLUMN "allotment_id_2",
DROP COLUMN "allotted_1",
DROP COLUMN "allotted_2",
ADD COLUMN     "fh_allotment" TEXT,
ADD COLUMN     "fh_allotted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sh_allotment" TEXT,
ADD COLUMN     "sh_allotted" BOOLEAN NOT NULL DEFAULT false;
