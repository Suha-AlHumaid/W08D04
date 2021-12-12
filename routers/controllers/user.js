const userModel = require("../../db/models/user");
const postModel = require("../../db/models/post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSimple = require('jwt-simple');
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
        const url = `http://localhost:5000/verify/${verificationToken}`;
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
    .find({isDele: false})
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      }else {
        res.status(404).json("There is no user to show");
      }
     
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

//delete user and his data soft delete
const deleteUserSoft = (req, res) => {
  const { id } = req.params;//user
console.log(id);
  userModel
    .findOneAndUpdate({_id: id , isDele: false}, { isDele: true },{new:true})
    .then((result) => {
      console.log(result);
      if (result) {
        postModel
            .updateMany({ puplisher:id, isDele: false }, { isDele: true })
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
  res.send(
    '<form action="/passwordreset" method="POST">' +
      '<input type="email" name="email" value="" placeholder="Enter your email address..." />' +
      '<input type="submit" value="Reset Password" />' +
      "</form>"
  );
};

const passwordReset = (req, res) => {
  if (req.body.email !== undefined) {
    const { email } = req.body;
    // TODO: Using email, find user from your database.
    userModel.findOne({ email }).then((result) => {
      console.log(result);

      const payload = {
        id: result._id, // User ID from database
        email: result.email,
      };
console.log(payload, "pay");
    // TODO: Make this a one-time-use token by using the user's
    // current password hash from the database, and combine it
    // with the user's created date to make a very unique secret key!
    // For example:
    const secret = result.password + `-` + result.avatar;
    // var secret = "fe1a1915a379f3be5394b64d14794932-1506868106675";

   const token = jwtSimple.encode(payload, secret);
    // TODO: Send email containing link to reset password.
    // In our case, will just return a link to click.
    res.send(
      `<a href="http://localhost:5000/resetpassword/${payload.id}/${token}">Reset password</a>`
    );
    });
  } else {
    res.send("Email address is missing.");
  }
};


const resetPassword=(req, res)=> {
  // TODO: Fetch user from database using
  // req.params.id
  const {id} = req.params //user id
  const {token}= req.params
  userModel.findById(id).then(result=>{
    console.log(result);
  // TODO: Decrypt one-time-use token using the user's
  // current password hash from the database and combine it
  // with the user's created date to make a very unique secret key!
  // For example,

  const secret = result.password + `-` + result.avatar;
  const payload = jwtSimple.decode(token, secret);
  console.log(payload);
  // TODO: Gracefully handle decoding issues.
  // Create form to reset password.
  res.send(`<form action="/resetpassword" method="POST">`+
      `<input type="hidden" name="id" value="` + payload.id + `" />` +
      `<input type="hidden" name="token" value="` + req.params.token + `" />` +
      `<input type="password" name="password" value="" placeholder="Enter your new password..." />` +
      `<input type="submit" value="Reset Password" />` +
  `</form>`);
  })
};
const passwordUpdated=(req, res)=>{
  // TODO: Fetch user from database using
  const {id}=req.body
  userModel.findById(id).then(async result=>{
  // TODO: Decrypt one-time-use token using the user's
  // current password hash from the database and combining it
  // with the user's created date to make a very unique secret key!
  // For example,
  // var secret = user.password + ‘-' + user.created.getTime();
  const secret = result.password + `-` + result.avatar;
  const payload = jwtSimple.decode(req.body.token, secret);


  // TODO: Gracefully handle decoding issues.
  // TODO: Hash password from
  const {password}=req.body
  const SALT = Number(process.env.SALT);
  const hashedPass = await bcrypt.hash(password, SALT);
  if(hashedPass){
    userModel
    .findByIdAndUpdate(id, { password: hashedPass }).then(result=>{
      res.send('Your password has been successfully changed.');
    }).catch(err=>{
      res.status(500).json(err)
    })
  }
  

  })

};
module.exports = {
  register,
  login,
  deleteUser,
  deleteUserSoft,
  getAllUser,
  verify,
  forgetPassword,
  passwordReset,
  resetPassword,
  passwordUpdated
};
