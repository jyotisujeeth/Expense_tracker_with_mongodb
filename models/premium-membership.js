const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const premiumMembershipSchema = new Schema({
  paymentId: {
    type: String,
  },
  orderId: {
    type: String,
  },
  status: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("PremiumMembersip", premiumMembershipSchema);