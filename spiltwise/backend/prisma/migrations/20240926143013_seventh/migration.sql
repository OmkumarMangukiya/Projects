/*
  Warnings:

  - Changed the type of `Lent` on the `Expense` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `Owes` on the `Expense` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "Lent",
ADD COLUMN     "Lent" JSONB NOT NULL,
DROP COLUMN "Owes",
ADD COLUMN     "Owes" JSONB NOT NULL;
