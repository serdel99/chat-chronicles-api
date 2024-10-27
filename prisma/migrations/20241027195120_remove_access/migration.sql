/*
  Warnings:

  - You are about to drop the `AccessToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `access_token` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refresh_token` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AccessToken" DROP CONSTRAINT "AccessToken_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "access_token" TEXT NOT NULL,
ADD COLUMN     "refresh_token" TEXT NOT NULL;

-- DropTable
DROP TABLE "AccessToken";
