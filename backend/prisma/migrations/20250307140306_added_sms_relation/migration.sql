-- AddForeignKey
ALTER TABLE "sms" ADD CONSTRAINT "sms_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
