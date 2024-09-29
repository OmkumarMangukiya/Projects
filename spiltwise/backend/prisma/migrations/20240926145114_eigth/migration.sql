/*
  Warnings:

  - Added the required column `authorId` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "authorId" TEXT NOT NULL;
