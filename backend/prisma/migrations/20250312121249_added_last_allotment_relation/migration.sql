/*
  Warnings:

  - A unique constraint covering the columns `[last_allot_id]` on the table `member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "member_last_allot_id_key" ON "member"("last_allot_id");

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_last_allot_id_fkey" FOREIGN KEY ("last_allot_id") REFERENCES "allotment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
