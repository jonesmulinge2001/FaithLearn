-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "verifyToken" DROP NOT NULL;
