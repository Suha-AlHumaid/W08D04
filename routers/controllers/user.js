const userModel = require("../../db/models/user");
const postModel = require("../../db/models/post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "Gmail",
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
    // .then((result) => {
    //   res.status(201).json(result);
    // })
    .catch((err) => {
      res.status(400).json(err);
    });
  // Step 2 - Generate a verification token with the user's ID
  const verificationToken = newUser.generateVerificationToken();

  // Step 3 - Email the user a unique verification link
  const url = `http://localhost:5000/verify/${verificationToken}`;
  transporter.sendMail({
    to: savedEmail,
    subject: "Verify Account",
    html: `Click <a href = '${url}'>here</a> to confirm your email.`,
  });
  return res.status(201).send({
    message: `Sent a verification email to ${savedEmail}`,
  });
};

const login = async (req, res) => {
  const { email,password } = req.body;

  if (email) {
    const savedEmail = email.toLowerCase();
    //    Step 1 - Verify a user with the email exists
    //    try{
    //     const user = await userModel.findOne({ email: savedEmail }).exec();
    //     if (!user) {
    //          return res.status(404).send({
    //                message: "User does not exists"
    //          });
    //     }
    //     // Step 2 - Ensure the account has been verified
    //     if(!user.verified){
    //          return res.status(403).send({
    //                message: "Verify your Account."
    //          });
    //     }
    //     return res.status(200).send({
    //          message: "User logged in"
    //     });
    //     } catch(err) {
    //     return res.status(500).send(err);
    //  }

    userModel
      .findOne({ email: savedEmail, isDele: false })
      .then(async (result) => {
        if (result) {
         
            if (result.verified== true) {
              console.log(result);
              const newpass = await bcrypt.compare(password, result.password);
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
            return res.status(403).send({
                message: "Verify your Account.",
              });
            }
       
        } else {
          res.status(404).json("Email  or user name does not exist");
        }
      })
      .catch((err) => {
        res.status(400).json(err);
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
    .find({})
    .then((result) => {
      if (result.length !== 0) {
        res.status(200).json(result);
      }
      res.status(404).json("There is no user to show");
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

//delete user and his data soft delete
const deleteUserSoft = (req, res) => {
  const { id } = req.params;

  userModel
    .findByIdAndUpdate(id, { isDele: true })
    .then((result) => {
      if (result) {
        if (result.isDele == true) {
          res.status(404).json("there is no user to delete");
        } else {
          res.status(404).json("there is no user to delete");
          taskModel
            .updateMany({ user: result._id, isDele: false }, { isDele: true })
            .then(() => {
              res.status(201).json(result);
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        }
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

  // Check we have an id
  if (!token) {
    return res.status(422).send({
      message: "Missing Token",
    });
  }
  // Step 1 -  Verify the token from the URL
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.secert_key);
  } catch (err) {
    return res.status(500).send(err);
  }

  // Step 2 - Find user with matching ID

  userModel
    .findOneAndUpdate({ _id: payload.ID }, { verified: true })
    .then((result) => {
      if (result) {
        res.status(201).json(result);
      } else {
        res.status(404).send({
          message: "User does not  exists",
        });
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });

  // Step 3 - Update user verification status to true
};
module.exports = {
  register,
  login,
  deleteUser,
  deleteUserSoft,
  getAllUser,
  verify,
};
