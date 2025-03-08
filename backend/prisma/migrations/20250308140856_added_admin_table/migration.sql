-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "admin_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_admin_name_key" ON "Admin"("admin_name");
