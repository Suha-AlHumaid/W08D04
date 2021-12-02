const postModel = require("../../db/models/post");
const userModel = require("../../db/models/user");
const commentModel = require("../../db/models/comment");

// get all comments (not deleted)
const getAllComments = (req, res) => {
  const { _id } = req.params; //post id

  postModel
    .findById(_id) //find post
    .then((result) => {
      if (result) {
        if (result.isDele == false) {
          commentModel
            .find({}) //find all comments for post
            .then((result) => {
              if (result.length !== 0) {
                res.status(201).json(result);
              } else {
                res.status(404).json("no comments");
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        } else {
          res.status(404).json("no post");
        }
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

//get comment by id
const getComment = (req, res) => {
  const { id } = req.params; //comment id
  let comment = null;
  commentModel
    .findById(id)
    .populate("post")
    .then((result) => {
      if (result) {
        if (result.isDele === false) {
          comment = result;
          // console.log(result.post);
          postModel
            .findById(result.post)
            .then((result) => {
              if (result) {
                if (result.isDele == false) {
                  res.status(200).json(comment);
                } else {
                  res.status(404).json("not found post");
                }
              } else {
                res.status(404).json("not found post");
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        } else {
          res.status(404).json("not found comment");
        }
      } else {
        res.status(404).json("not found comment");
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

//create new comment
const addComment = (req, res) => {
  const id = req.suha._id;
  const { discription } = req.body;
  const { _id } = req.params; //post id
  userModel
    .findById(id) // find user
    .then((result) => {
      if (result) {
        if (result.isDele == false) {
          const newComment = new commentModel({
            discription,
            post: _id,
            puplisher: result._id,
          });

          newComment.save();
          console.log(newComment);
          res.status(201).json(newComment);
        }
      }
      res.status(404).json("user dose not exist");
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

//soft delete Comment
const deleteComment = (req, res) => {
  try {
    const id = req.suha._id;
    const { _id } = req.params; //comment id
    userModel //find user
      .findById(id)
      .then((result) => {
        if (result) {
          if (result.isDele) {
            res.status(404).json("user dose not exist");
          } else {
            commentModel
              .findByIdAndUpdate({ _id }, { isDele: true })
              .then((result) => {
                if (result.isDele == false) {
                  res.status(201).json("comment deleted");
                } else {
                  res.status(404).json("comment already deleted");
                }
              })
              .catch((err) => {
                res.status(400).json(err);
              });
          }
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } catch (error) {
    res.status(400).json(error);
  }
};

////update Comment
const updateComment = (req, res) => {
  try {
    const id = req.suha._id; //user
    const { _id } = req.params; //comment
    const { discription } = req.body;

    //discription
    if (discription) {
      userModel
        .findById(id)
        .then((result) => {
          commentModel
            .findByIdAndUpdate({ _id }, { discription }, { new: true })
            .then((result) => {
              if (result) {
                console.log(result);
                if (result.isDele == true) {
                  res.status(404).json("not found comment");
                } else {
                  res.status(200).json(result);
                }
              } else {
                res.status(404).json("not found comment");
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

//delete any comments or post
const deleteAnyCommentOrPost = (req, res) => {
  const { post_id, _id } = req.body; //user of comment and post id

  //delete post
  if (post_id) {
    postModel
      .findByIdAndDelete(post_id)
      .then((result) => {
        if (result) {
          if (result.isDele == true) {
            res.status(404).json("not found post");
          } else {
            //post found
            commentModel
              .deleteMany({ post: result._id })
              .then((result) => {
                res.status(201).json(result);
              })
              .catch((error) => {
                res.status(400).json(error);
              });
          }
        } else {
          res.status(404).json("not found post");
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }

  //delete comment
  if (_id) {
    commentModel.findByIdAndDelete(_id).then((result) => {
      if (result) {
        if (result.isDele == true) {
          res.status(404).json("not found comment");
        } else {
          //comment found
          res.status(201).json(result);
        }
      } else {
        res.status(404).json("not found comment");
      }
    });
  }
};

const deleteCommentOfUserPost = (req, res) => {
  const { _id } = req.params; // post id
  const { comment_id } = req.body; //comment id
  const id = req.suha._id; //user id

  userModel
    .findById(id)
    .then((result) => {
      console.log(result);
          //user found
          postModel
          .findById({_id:_id})
            .then((result) => {
              console.log(result);
                  commentModel
                    .findByIdAndDelete(comment_id)
                    .then((result) => {
                      console.log(result);
              
                          //comment found
                        
                          res.status(201).json(result);
                        })
            
              
                    .catch((err) => {
                      res.status(400).json(err);
                    });
                  }

   )})
    .catch((err) => {
      res.status(400).json(err);
    });
};

module.exports = {
  getAllComments,
  getComment,
  addComment,
  deleteComment,
  updateComment,
  deleteAnyCommentOrPost,
  deleteCommentOfUserPost,
};
