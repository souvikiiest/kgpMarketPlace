-- DropIndex
DROP INDEX "User_phoneNo_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phoneNo" SET DATA TYPE TEXT;
