-- CreateEnum
CREATE TYPE "Status" AS ENUM ('current', 'previous');

-- CreateTable
CREATE TABLE "member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" VARCHAR(10) NOT NULL,
    "email" TEXT,
    "status" "Status" NOT NULL DEFAULT 'previous',
    "last_allot_id" TEXT,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seat" (
    "seat_num" INTEGER NOT NULL,
    "allotted_1" BOOLEAN NOT NULL DEFAULT false,
    "allotted_2" BOOLEAN NOT NULL DEFAULT false,
    "allotment_id_1" TEXT,
    "allotment_id_2" TEXT,

    CONSTRAINT "seat_pkey" PRIMARY KEY ("seat_num")
);

-- CreateTable
CREATE TABLE "allotment" (
    "id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "seat_num" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "full_day" BOOLEAN NOT NULL DEFAULT false,
    "start_time" INTEGER NOT NULL,
    "end_time" INTEGER NOT NULL,

    CONSTRAINT "allotment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "allotment" ADD CONSTRAINT "allotment_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allotment" ADD CONSTRAINT "allotment_seat_num_fkey" FOREIGN KEY ("seat_num") REFERENCES "seat"("seat_num") ON DELETE RESTRICT ON UPDATE CASCADE;
