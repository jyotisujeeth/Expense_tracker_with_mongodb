const Expense = require("../models/expenses");
const User = require("../models/user");

const AWS = require("aws-sdk");

const Userservices = require("../service/userservices");

const S3services = require("../service/s3services");

exports.downloadExpense = async (req, res, next) => {
  try {
    const expenses = await Userservices.getExpenses(req);
    console.log(expenses);

    const stringyfyExpenses = JSON.stringify(expenses);
    //for creating a txt file we have to stringify it
    //because is an array rightnow

    const userId = req.user.id;

    const filename = `Expense${userId}/${new Date()}.txt`;

    const fileURL = await S3services.uploadToS3(stringyfyExpenses, filename);

    const downloadUrlData = await req.user.createDownloadurl({
      fileURL: fileURL,
      filename,
    });
    console.log(req);

    res.status(200).json({ fileURL, downloadUrlData, success: true });
  } catch (error) {
    res.status(500).json({ fileURL: "", success: false });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    const expenses = await Expense.find();
    const useraggregate = {};
    expenses.forEach((expense) => {
      if (useraggregate[expense.userId]) {
        useraggregate[expense.userId] =
          useraggregate[expense.userId] + expense.expenseamount;
      } else {
        useraggregate[expense.userId] = expense.expenseamount;
      }
    });
    console.log(useraggregate);
    var leaderboard = [];
    users.forEach((user) => {
      leaderboard.push({
        name: user.name,
        totalExpense: useraggregate[user.id] || 0,
      });
    });
    leaderboard.sort((a, b) => b.totalExpense - a.totalExpense);
    console.log(leaderboard);
    res.status(200).json(leaderboard);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getLeaderBoardUser = async (req, res, next) => {
  try {
    if (req.user.ispremiumuser) {
      const userId = req.params.loadUserId;
      const user = await User.find({ _id: userId });
      // const expenses = await user.getExpenses();
      return res.status(200).json({ leaderboard, success: true });
    }
  } catch (error) {
    return res.status(500).json({ success: false, data: error });
  }
};

exports.addExpense = async (req, res, next) => {
  const { expenseamount, description, category } = req.body;
  try {
    if (!expenseamount || !description || !category) {
      return res.status(400).json({ message: "no fields can be empty" });
    }
    const data = new Expense({
      expenseamount: expenseamount,
      description: description,
      category: category,
      userId: req.user,
    });
    data.save().then(() => {
      // req.user.updateLatestExpenses();
      res.status(200).json({
        newExpenseDetail: data,
        success: true,
        message: "expense successfully added",
      });
      // res.status(201).json({ newExpenseDetail: data });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

exports.getExpenses = async (req, res, next) => {
  const { expenseamount, description, category } = req.body;

  let page = req.params.pageNo || 1;
  // console.log(page);
  let Items_Per_Page = +req.body.Items_Per_Page || 5;

  // console.log(Items_Per_Page);
  let totalItems;
  let lastPage;
  try {
    // let data = await req.user.getExpenses();
    // res.status(200).json({ data });

    Expense.find({ userId: req.user })
      .skip((page - 1) * Items_Per_Page)
      .limit(Items_Per_Page)
      .then((expenses) => {
        Expense.count({ userId: req.user }).then((result) => {
          totalItems = result;

          if (lastPage === 0) {
            lastPage = 1;
          }
          res.status(200).json({
            data: expenses,
            info: {
              currentPage: page,
              hasNextPage: totalItems > page * Items_Per_Page,
              hasPreviousPage: page > 1,
              nextPage: +page + 1,
              PreviousPage: +page - 1,
              lastPage: Math.ceil(totalItems / Items_Per_Page),
            },
          });
        });
      });

    // let data = await req.user.getExpenses({
    //   offset: (page - 1) * Items_Per_Page,
    //   limit: Items_Per_Page,
    // });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      res.status(400).json({ error: "id missing" });
    }

    Expense.findByIdAndRemove(userId).then(() => {
      console.log("00000");
      // await Expense.destroy({ where: { Id: eid } });
      // return res.status(200);

      // await req.user.getExpenses({ where: { id: userId } }).then((expense) => {
      //   let findExpenses = expense[0];
      //   findExpenses.destroy();
      res
        .status(200)
        .json({ success: true, message: "expense successfully deleted" });
    });
  } catch (err) {
    console.log("delete", err);
    res.status(500).json(err);
  }
};

exports.downloadAllUrl = async (req, res, next) => {
  try {
    let urls = await req.user.getDownloadurls();
    if (!urls) {
      res
        .status(404)
        .json({ message: "no urls found with this user", success: false });
    }
    res.status(200).json({ urls, success: true });
  } catch (error) {
    res.status(500).json({ error });
  }
};