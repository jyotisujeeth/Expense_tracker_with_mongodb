const uuid = require("uuid");
const sgMail = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const Forgotpassword = require("../models/forgotPassword");

exports.getForgotpassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      // const id = uuid.v4();

      // console.log(id);
      let newRequest = await Forgotpassword.create({
        active: true,
        userId: user,
      }).catch((err) => {
        throw new Error(err);
      });

      //sendgrid
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: email, //Change to your recipient
        from: "jyotisujeeth@gmail.com", //Change to your verified sender
        subject: "Sending with Sendgrid is Fun",
        text: "and easy to do anywhere,even with Node.js",
        html: `<h1> href="http:/localhost:3000/password/resetpassword/${newRequest._id}">Reset passowrd</h1>`,
      };
      sgMail
        .send(msg)
        .then((response) => {
          return res.status(response[0].statusCode).json({
            message: "Link to reset password send to your mail",
            success: true,
          });
        })
        .catch((error) => {
          throw new Error(error);
        });
    } else {
      throw new Error("User doesnt exist");
    }
  } catch (err) {
    console.error(err);
    return res.json({ message: err, success: false });
  }
};

exports.getResetpassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    Forgotpassword.findOne({ _id: id }).then((forgotpasswordrequest) => {
      if (forgotpasswordrequest) {
        if (forgotpasswordrequest.active === true) {
          forgotpasswordrequest.active = false;
          forgotpasswordrequest.save().then(() => {
            res.status(200).send(`<html>
                                                <script>
                                                    function formsubmitted(e){
                                                        e.preventDefault();
                                                        console.log('called')
                                                    }
                                                </script>
                                                <form action="http://localhost:3000/password/getupdatepassword/${id}" method="get">
                                                    <label for="newpassword">Enter New password</label>
                                                    <input name="newpassword" type="password" required></input>
                                                    <button>reset password</button>
                                                </form>
                                            </html>`);
          });
        } else {
          throw new Error("request has expired");
        }
      } else {
        throw new Error("request not found");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getUpdatepassword = async (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
    Forgotpassword.findOne({ _id: resetpasswordid }).then(
      (resetpasswordrequest) => {
        User.findOne({ _id: resetpasswordrequest.userId }).then((user) => {
          // console.log('userDetails', user)
          if (user) {
            //encrypt the password

            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, function (err, salt) {
              if (err) {
                console.log(err);
                throw new Error(err);
              }
              bcrypt.hash(newpassword, salt, function (err, hash) {
                // Store hash in your password DB.
                if (err) {
                  console.log(err);
                  throw new Error(err);
                }
                user.update({ password: hash }).then(() => {
                  res
                    .status(201)
                    .json({ message: "Successfuly update the new password" });
                });
              });
            });
          } else {
            return res
              .status(404)
              .json({ error: "No user Exists", success: false });
          }
        });
      }
    );
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};