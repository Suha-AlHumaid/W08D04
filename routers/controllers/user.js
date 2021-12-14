const userModel = require("../../db/models/user");
const postModel = require("../../db/models/post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSimple = require("jwt-simple");
const { OAuth2Client } = require("google-auth-library");

require("dotenv").config();

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const register = async (req, res) => {
  const { email, userName, avatar, password, role } = req.body;

  const savedEmail = email.toLowerCase();
  const SALT = Number(process.env.SALT);
  const hashedPass = await bcrypt.hash(password, SALT);

  // Check if the email is in use
  const existingUser = await userModel.findOne({ email: savedEmail }).exec();
  if (existingUser) {
    return res.status(409).send({
      message: "Email is already in use.",
    });
  }

  // Step 1 - Create and save the user
  const newUser = new userModel({
    email: savedEmail,
    userName,
    avatar,
    password: hashedPass,
    role,
  });

  newUser
    .save()
    .then((result) => {
      const verificationToken = newUser.generateVerificationToken();
      // Step 3 - Email the user a unique verification link
      const url = `http://localhost:3000/verify/${verificationToken}`;
      transporter.sendMail({
        to: savedEmail,
        subject: "Verify Account",
        html: `Click <a href = '${url}'>here</a> to confirm your email.`,
      });
      return res.status(201).send({
        message: `Sent a verification email to ${savedEmail}`,
      });
    })
    .catch((error) => {
      res.status(400).json(error);
    });
  // Step 2 - Generate a verification token with the user's ID
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (email) {
    const savedEmail = email.toLowerCase();

    userModel
      .findOne({ email: savedEmail, isDele: false })
      .then(async (result) => {
        if (result) {
          if (result.verified == true) {
            console.log(result);
            const newpass = await bcrypt.compare(password, result.password);
            console.log(newpass);
            if (newpass) {
              const options = {
                expiresIn: "7d",
              };
              const token = jwt.sign(
                { role: result.role, _id: result._id },
                process.env.secert_key,
                options
              );
              res.status(200).json({ result, token });
            } else {
              res.status(404).json("Invalaid password  or email");
            }
          } else {
            return res.status(403).json({
              message: "Verify your Account.",
            });
          }
        } else {
          res.status(404).json("Email  or user name does not exist");
        }
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }

  // if (userName) {
  //   userModel
  //     .findOne({ userName })
  //     .then(async (result) => {
  //       if (result) {
  //         if (result.isDele == false) {
  //           if (userName == result.userName) {
  //             const newpass = await bcrypt.compare(password, result.password);
  //             if (newpass) {
  //               const options = {
  //                 expiresIn: 900 * 900,
  //               };
  //               const token = jwt.sign(
  //                 { role: result.role, _id: result._id, isDele: result.isDele },
  //                 process.env.secert_key,
  //                 options
  //               );
  //               res.status(200).json({ result, token });
  //             } else {
  //               res.status(404).json("Invalaid password  or email");
  //             }
  //           } else {
  //             res.status(404).json("Invalaid password or email");
  //           }
  //         } else {
  //           res.status(404).json("User name does not exist");
  //         }
  //       } else {
  //         res.status(404).json("Email  or user name does not exist");
  //       }
  //     })
  //     .catch((err) => {
  //       res.status(400).json(err);
  //     });
  // }
};

//delete user and his data
const deleteUser = (req, res) => {
  const { id } = req.params;
  userModel
    .findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        postModel
          .deleteMany({ user: result._id })
          .then((result) => {
            res.status(201).json(result);
          })
          .catch((error) => {
            res.status(400).json(error);
          });
      } else {
        res.status(404).json("there is no user to delete");
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};
//get all user
const getAllUser = (req, res) => {
  userModel
    .find({ isDele: false })
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json("There is no user to show");
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

//delete user and his data soft delete
const deleteUserSoft = (req, res) => {
  const { id } = req.params; //user
  console.log(id);
  userModel
    .findOneAndUpdate(
      { _id: id, isDele: false },
      { isDele: true },
      { new: true }
    )
    .then((result) => {
      console.log(result);
      if (result) {
        postModel
          .updateMany({ puplisher: id, isDele: false }, { isDele: true })
          .then((result) => {
            res.status(201).json("deleted");
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      } else {
        res.status(404).json("there is no user to delete");
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const verify = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(422).send({
      message: "Missing Token",
    });
  }

  let payload = null;
  try {
    payload = jwt.verify(token, process.env.secert_key);
  } catch (err) {
    return res.status(500).send(err);
  }

  userModel
    .findOneAndUpdate({ _id: payload.ID }, { verified: true })
    .then((result) => {
      if (result) {
        res.status(201).json({ message: "verified", success: true, result });
        res.redirect("/login");
      } else {
        res.status(404).send({
          message: "User does not  exists",
        });
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

const forgetPassword = (req, res) => {
  const { email } = req.body;
  const savedEmail = email.toLowerCase();
  if (savedEmail) {
    userModel
      .findOne({ email: savedEmail })
      .then((result) => {
        if (result) {
          console.log(result);
          const payload = {
            id: result._id, // User ID from database
            email: savedEmail,
          };

          console.log(payload, "pay");
          // TODO: Make this a one-time-use token by using the user's
          // current password hash from the database, and combine it
          const secret = result.password + `-` + result.avatar;

          const token = jwtSimple.encode(payload, secret);

          // TODO: Send email containing link to reset password.
          // In our case, will just return a link to click.
          const url = `http://localhost:3000/passwordreset/${payload.id}/${token}`;
          console.log(url);
          transporter.sendMail({
            to: savedEmail,
            subject: "Reset password",
            html: `Click <a href = '${url}'>here</a> to reset passord.`,
          });

          res.status(200).json("sent email");
        } else {
          res.status(404).json("not found email");
        }
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  }
};

const resetPassword = (req, res) => {
  const { id } = req.params; //user id
  const { token } = req.params;
  userModel.findById(id).then((result) => {
    const secret = result.password + `-` + result.avatar;
    const payload = jwtSimple.decode(token, secret);
  });

  userModel.findById(id).then(async (result) => {
    const { password } = req.body;
    const SALT = Number(process.env.SALT);
    const hashedPass = await bcrypt.hash(password, SALT);
    if (hashedPass) {
      userModel
        .findByIdAndUpdate(id, { password: hashedPass })
        .then((result) => {
          res.status(200).json("Your password has been successfully changed.");
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    }
  });
};

const client = new OAuth2Client(
  "426069343336-4qrce5u8on7li4kht6rtprfj9sfcikkk.apps.googleusercontent.com"
);
const googleLogin = (req, res) => {
  const { tokenId } = req.body;

  client
    .verifyIdToken({
      idToken: tokenId,
      audience:
        "426069343336-4qrce5u8on7li4kht6rtprfj9sfcikkk.apps.googleusercontent.com",
    })
    .then((result) => {
      // console.log("result from google",result.payload);
      const { email_verified, name, email, profileObj } = result.payload;
      if (email_verified) {
        userModel.findOne({ email }).exec((err, user) => {
          if (err) {
            return res.status(400).json(err);
          } else {
            if (user) {
              //login
              const options = {
                expiresIn: "7d",
              };
              const token = jwt.sign(
                { role: user.role, _id: user._id },
                process.env.secert_key,
                options
              );
              const result = {
                _id: user._id,
                userName: name,
                email,
                role: "61a744e5313b1e7127be4634",
              };
              res.status(200).json({ result, token });
            } else {
              //create new user
              let password = email + process.env.secert_key;
              const newUser = new userModel({
                userName: name,
                password,
                email,
                role: "61a744e5313b1e7127be4634",
              });
              newUser.save((err, data) => {
                if (err) {
                  return res.status(400).json(err);
                }

                const token = jwt.sign(
                  { role: data.role, _id: data._id },
                  process.env.secert_key,
                  {
                    expiresIn: "7d",
                  }
                );
                const { _id, name, email, role } = newUser;
                res.status(200).json({ result: data, token });
              });
            }
          }
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  register,
  login,
  deleteUser,
  deleteUserSoft,
  getAllUser,
  verify,
  forgetPassword,
  // passwordReset,
  resetPassword,
  // passwordUpdated
  googleLogin,
};
