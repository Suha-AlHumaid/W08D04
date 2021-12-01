const postModel = require("../../db/models/post");
const userModel = require("../../db/models/user");

//get all posts (not deleted)
const getAllPosts = (req, res) => {
  const _id = req.suha._id;

  userModel
    .findById({ _id })
    .then((result) => {
      postModel.find({ user: result._id }).then((result) => {
        const filtered = result.filter((elem) => elem.isDele === false);
        if (filtered.length !== 0) {
          res.status(201).json(filtered);
        } else {
          res.status(404).json("There is no posts to show");
        }
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

//get post by id
const getPost = (req, res) => {
  const { id } = req.params;
  const userId = req.suha._id;

  userModel
    .findById({ _id: userId })
    .then((user) => {
      if (user) {
        if (user.isDele == true) {
          res.status(404).json("user dose not exist");
        } else {
          postModel
            .findById(id)

            .then((result) => {
              if (result.isDele === false) {
                res.status(200).json(result);
              }
              res.status(404).json("There is no posts to show");
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        }
      } else {
        res.status(404).json("user dose not exist");
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

//create new post
const addPost = (req, res) => {
  const id = req.suha._id;
  const { avatar, discription, title } = req.body;
  userModel
    .findById(id)
    .then((result) => {
      if (result) {
        if (result.isDele == false) {
          const newPost = new postModel({
            avatar,
            discription,
            title,
            puplisher: result._id,
          });

          newPost.save();
          console.log(newPost);
          res.status(201).json(newPost);
        }
      }
      res.status(404).json("user dose not exist");
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

//soft delete post
const deletePost = (req, res) => {
  try {
    const id = req.suha._id;
    const { _id } = req.params;
    userModel
      .findById({ _id: id })
      .then((result) => {
        postModel
          .findByIdAndUpdate({ _id }, { isDele: true }, { new: true })
          .then((result) => {
            console.log(result);
            if (result.isDele == false) {
              res.status(200).json(result);
            } else {
              res.status(404).json("Post already deleted");
            }
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } catch (error) {
    res.status(400).json(error);
  }
};

////update post
const updatePost = (req, res) => {
  try {
    const id = req.suha._id;
    const { _id } = req.params;
    const { avatar, discription, title } = req.body;

    //avatar
    if (avatar) {
      userModel
        .findById({ _id: id })
        .then((result) => {
          postModel
            .findByIdAndUpdate({ _id }, { avatar: avatar }, { new: true })
            .then((result) => {
              console.log(result);
              if (result.isDele == false) {
                res.status(200).json(result);
              } else {
                res.status(404).json("Post already deleted");
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }

    //discription
    if (discription) {
      userModel
        .findById({ _id: id })
        .then((result) => {
          postModel
            .findByIdAndUpdate(
              { _id },
              { discription: discription },
              { new: true }
            )
            .then((result) => {
              console.log(result);
              if (result.isDele == false) {
                res.status(200).json(result);
              } else {
                res.status(404).json("Post already deleted");
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }

    //title
    if (title) {
      userModel
        .findById({ _id: id })
        .then((result) => {
          postModel
            .findByIdAndUpdate({ _id }, { title: title }, { new: true })
            .then((result) => {
              console.log(result);
              if (result.isDele == false) {
                res.status(200).json(result);
              } else {
                res.status(404).json("Post already deleted");
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
module.exports = { getAllPosts, getPost, addPost, deletePost, updatePost };
// avatar,
// discription,
// title,
// Date,
// isDele,
// puplisher,
// like
