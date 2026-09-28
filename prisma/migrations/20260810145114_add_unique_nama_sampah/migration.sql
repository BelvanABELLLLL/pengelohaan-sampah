/*
  Warnings:

  - A unique constraint covering the columns `[namaSampah]` on the table `JenisSampah` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JenisSampah_namaSampah_key" ON "JenisSampah"("namaSampah");
