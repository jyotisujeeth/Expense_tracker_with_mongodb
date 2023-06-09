const User = require("../models/user");
const bcrypt = require("bcrypt");
const PremiumUser = require("../models/premium-membership");
const Download = require("../models/downloadUrls");

const jwt = require("jsonwebtoken");

// const user = require("../models/user");
const saltRounds = 10;

exports.addUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (name.length > 0 && email.length > 0 && password.length > 0) {
    const user = await User.exists({ email: email });
    // console.log(user);
    if (user) {
      // console.log(user);
      return res.status(409).json({ message: "User already exists!" });
    }
    bcrypt.hash(password, saltRounds, function (error, hash) {
      // Store hash in your password DB.
      const user = new User({
        name: name,
        email: email,
        password: hash,
        isPremiumUser: false,
        latestExpenses: {
          expenses: [],
          totalOfMonth: 0,
        },
        premimiumMemberships: [],
        forgotPasswordRequests: [],
        downloads: [],
      });
      user
        .save()
        .then(() => {
          res.status(200).send({ success: true, message: "new user created" });
        })
        .catch((err) => {
          console.log(err);

          res.status(500).json({ success: false, message: err });
        });
    });
  } else {
    res.status(400).json({ success: false, message: "bad parameters" });
  }
};

exports.logUser = (req, res, next) => {
  const { email, password } = req.body;

  if (email.length > 0 && password.length > 0) {
    User.find({ email: email })
      .then((users) => {
        // console.log(users);
        const user = users[0];
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "user does not exist" });
        }

        bcrypt.compare(password, user.password, function (error, result) {
          if (error) {
            return res.status(500).json({ success: false, message: err });
          }
          if (result == true) {
            const token = jwt.sign(
              { userId: user.id, name: user.name },
              "secretKey"
            );
            res.status(200).json({
              success: true,
              message: "user found",
              token: token,
            });
          } else {
            res
              .status(401)
              .json({ success: false, message: "password is incorrect" });
          }
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ success: false, message: err });
      });
  } else {
    res.status(400).json({ success: false, message: "bad parameters" });
  }
};