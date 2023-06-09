const Razorpay = require("razorpay");
const Order = require("../models/orders");
const PremiumUser = require("../models/premium-membership");
const Download = require("../models/downloadUrls");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
// function generateToken(id, name, ispremiumuser) {
//   return jwt.sign(
//     { userId: id, name: name, ispremiumuser: ispremiumuser },
//     process.env.TOKEN
//   );
// }

const purchasepremium = async (req, res) => {
  try {
    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    let order = await instance.orders.create({
      amount: 50000,
      currency: "INR",
    });

    PremiumUser.create({
      orderId: order.id,
      status: "PENDING",
      userId: req.user,
    })
      .then(() => {
        res.status(201).json({
          success: true,
          order,
          key_id: instance.key_id,
          orderStatus: "pending",
          message: "order is created",
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error });
  }
};
const updateTransactionStatus = async (req, res) => {
  try {
    const { order_id, payment_id } = req.body;

    PremiumUser.findOne({ orderId: order_id })
      .then((premiumUser) => {
        premiumUser.paymentId = payment_id;
        premiumUser.status = "SUCCESSFUL";
        return premiumUser.save();

        // premiumUser.update({paymentId: payment_id, status: 'SUCCESSFUL'})
        //     .then(() => {
        //         return req.user.update({isPremiumUser: true});
        //     })
        //     .then(() => {
        //         res.status(202).json({success: true, message: 'transaction successful'});
        //     })
        //     .catch(err => {
        //         throw new Error(err);
        //     });
      })
      .then(() => {
        console.log("new premium member added");
        req.user.isPremiumUser = true;
        return req.user.save();
      })
      .then(() => {
        console.log("premium status in user collection updated");
        res
          .status(202)
          .json({ success: true, message: "transaction successful" });
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (error) {
    console.log(error);
    res
      .status(403)
      .json({ success: false, message: "something went wrong", err: error });
  }
};
exports.checkMembership = (req, res) => {
  if (req.user.isPremiumUser) {
    res.status(200).json({ message: "user has Premium Membership" });
  } else {
    res.status(404).json({ message: "user does not have Premium Membership" });
  }
};
module.exports = {
  purchasepremium,
  updateTransactionStatus,
};