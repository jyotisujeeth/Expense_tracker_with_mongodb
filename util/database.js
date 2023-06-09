const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.d7wxssa.mongodb.net/expenseDb"
  )
    .then((client) => {
      console.log("Connected!");
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

module.exports = mongoConnect;