const forgotpasswordController = require("../controllers/forgotpassword");

const express = require("express");

const router = express.Router();

router.use("/forgotpassword", forgotpasswordController.getForgotpassword);
router.get("/resetpassword/:id", forgotpasswordController.getResetpassword);
router.get(
  "/updatepassword/:resetpasswordid",
  forgotpasswordController.getUpdatepassword
);

module.exports = router;