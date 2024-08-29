/*
  Warnings:

  - You are about to drop the `_ExpenseToGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ExpenseToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_ExpenseToGroup" DROP CONSTRAINT "_ExpenseToGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExpenseToGroup" DROP CONSTRAINT "_ExpenseToGroup_B_fkey";

-- DropForeignKey
ALTER TABLE "_ExpenseToUser" DROP CONSTRAINT "_ExpenseToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExpenseToUser" DROP CONSTRAINT "_ExpenseToUser_B_fkey";

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "authorId" TEXT NOT NULL DEFAULT '0',
ADD COLUMN     "groupId" TEXT NOT NULL DEFAULT '0';

-- DropTable
DROP TABLE "_ExpenseToGroup";

-- DropTable
DROP TABLE "_ExpenseToUser";

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
