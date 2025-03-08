-- CreateTable
CREATE TABLE "sms" (
    "id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "sms_body" TEXT,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "all_members" BOOLEAN NOT NULL DEFAULT false,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sms_pkey" PRIMARY KEY ("id")
);
