const express = require("express");

const userController = require("../controllers/user");

const expenseController = require("../controllers/expense");

const router = express.Router();

const userAuthentication = require("../middleware/auth");

router.post("/signup", userController.addUser);

router.post("/login", userController.logUser);

router.post(
  "/getExpenses/:pageNo",
  userAuthentication.authentication,
  expenseController.getExpenses
);

router.post(
  "/addExpense",
  userAuthentication.authentication,
  expenseController.addExpense
);

router.delete(
  "/deleteExpense/:userId",
  userAuthentication.authentication,
  expenseController.deleteExpense
);

module.exports = router;