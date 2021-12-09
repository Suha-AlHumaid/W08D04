const userModel = require("../../db/models/user");
const postModel = require("../../db/models/post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const register = async (req, res) => {
  const { email, userName, avatar, password, role } = req.body;

  const savedEmail = email.toLowerCase();
  const SALT = Number(process.env.SALT);
  const hashedPass = await bcrypt.hash(password, SALT);

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
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const login = (req, res) => {
  const { email, userName, password } = req.body;

  if (email) {
    const savedEmail = email.toLowerCase();
    userModel
      .findOne({ email: savedEmail })
      .then(async (result) => {
        if (result) {
        
          if (result.isDele == false) {
        
              const newpass = await bcrypt.compare(password, result.password);
              if (newpass) {
                const options = {
                  expiresIn: 60 * 60,
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
            res.status(404).json("Email  or user name does not exist");
          }
        } else {
          res.status(404).json("Email  or user name does not exist");
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }

  if (userName) {
    userModel
      .findOne({ userName })
      .then(async (result) => {
        if (result) {
          if (result.isDele == false) {
            if (userName == result.userName) {
              const newpass = await bcrypt.compare(password, result.password);
              if (newpass) {
                const options = {
                  expiresIn: 900 * 900,
                };
                const token = jwt.sign(
                  { role: result.role, _id: result._id, isDele: result.isDele },
                  process.env.secert_key,
                  options
                );
                res.status(200).json({ result, token });
              } else {
                res.status(404).json("Invalaid password  or email");
              }
            } else {
              res.status(404).json("Invalaid password or email");
            }
          } else {
            res.status(404).json("User name does not exist");
          }
        } else {
          res.status(404).json("Email  or user name does not exist");
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
};

//delete user and his data
const deleteUser = (req, res) => {
  const { id } = req.params;
  userModel
    .findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        console.log(result);
        postModel
          .deleteMany({ user: result._id })
          .then((result) => {
            console.log(result);
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
  console.log(id);

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

module.exports = { register, login, deleteUser, deleteUserSoft, getAllUser };
