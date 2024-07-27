/*
  Warnings:

  - Made the column `phoneNo` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phoneNo" SET NOT NULL,
ALTER COLUMN "phoneNo" DROP DEFAULT,
ALTER COLUMN "phoneNo" SET DATA TYPE TEXT;
