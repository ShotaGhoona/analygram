/*
  Warnings:

  - A unique constraint covering the columns `[igId]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `igId` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longToken` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "igId" TEXT NOT NULL,
ADD COLUMN     "longToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "companies_igId_key" ON "companies"("igId");
