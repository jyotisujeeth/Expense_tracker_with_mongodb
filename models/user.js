const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Expense = require("../models/expenses");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  isPremiumUser: {
    type: Boolean,
    required: true,
    default: false,
  },
  latestExpenses: {
    expenses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Expense",
        required: true,
      },
    ],
    totalExpense: {
      type: Number,
      required: true,
    },
    // totalOfMonth: {
    //   type: Number,
    //   required: true,
    // },
  },
});

// userSchema.methods.updateLatestExpenses = function () {
//   try {
//     const currDate = new Date();
//     Expense.find({ userId: this }).then((expenses) => {
//       let requiredExpenses = [];
//       let total = 0;
//       // expenses.forEach((e) => {
//       //   //console.log(e.createdAt.getMonth());
//       //   if (e.createdAt.getMonth() === currDate.getMonth()) {
//       //     requiredExpenses.push(e);
//       //     total += e.amount;
//       //   }
//       // });
//       this.latestExpenses.expenses = requiredExpenses;
//       // this.latestExpenses.totalOfMonth = total;

//       this.save();
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

module.exports = mongoose.model("User", userSchema);