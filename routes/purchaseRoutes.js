const path = require("path");

const express = require("express");

const purchaseController = require("../controllers/purchase");

const authenticationMiddleware = require("../middleware/auth");

const router = express.Router();

router.get(
  "/premiummembership",
  authenticationMiddleware.authentication,
  purchaseController.purchasepremium
);

router.post(
  "/updatetransactionstatus",
  authenticationMiddleware.authentication,
  purchaseController.updateTransactionStatus
);

module.exports = router;