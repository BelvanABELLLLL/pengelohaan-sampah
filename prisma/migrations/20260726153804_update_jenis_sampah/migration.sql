/*
  Warnings:

  - You are about to drop the column `namaJenis` on the `JenisSampah` table. All the data in the column will be lost.
  - Added the required column `jenisSampah` to the `JenisSampah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaSampah` to the `JenisSampah` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "JenisSampah_namaJenis_key";

-- AlterTable
ALTER TABLE "JenisSampah" DROP COLUMN "namaJenis",
ADD COLUMN     "jenisSampah" TEXT NOT NULL,
ADD COLUMN     "namaSampah" TEXT NOT NULL;
