-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Total" DOUBLE PRECISION NOT NULL,
    "DivideTo" JSONB NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExpenseToGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ExpenseToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExpenseToGroup_AB_unique" ON "_ExpenseToGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_ExpenseToGroup_B_index" ON "_ExpenseToGroup"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExpenseToUser_AB_unique" ON "_ExpenseToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ExpenseToUser_B_index" ON "_ExpenseToUser"("B");

-- AddForeignKey
ALTER TABLE "_ExpenseToGroup" ADD CONSTRAINT "_ExpenseToGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExpenseToGroup" ADD CONSTRAINT "_ExpenseToGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExpenseToUser" ADD CONSTRAINT "_ExpenseToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExpenseToUser" ADD CONSTRAINT "_ExpenseToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
