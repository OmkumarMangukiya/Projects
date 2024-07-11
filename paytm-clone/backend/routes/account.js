const express = require("express");
const { Account } = require("../db");
const { authMiddleware } = require("../middleware");
const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId });
    if (!account) {
      res.json({ message: "Account not found" });
      return
    }
    res.json({ balance: account.balance });
  } catch (error) {
    console.error("Error retrieving account balance:", error);
    res.status(500).json({ error: "Internal server error" });
    return
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await Account.startSession();
  session.startTransaction();
  const { to, amount } = req.body;
  const fromAccount = await Account.findOne({ userId: req.userId }).session(session);
  if (!fromAccount || fromAccount.balance < amount) {
    res.json({
      msg: "Insufficient Balance",
    });
    return
  }

  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);
  await Account.updateOne(
    { userId: to },
    { $inc: { balance: +amount } }
  ).session(session);
  await session.commitTransaction();
  res.status(200).json({
    msg: "Transfer Successful",
  });
  return
});
module.exports = router;
