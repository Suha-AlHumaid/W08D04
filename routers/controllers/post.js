const postModel = require("../../db/models/post");
const userModel = require("../../db/models/user");
const commentModel = require("../../db/models/comment");
const likeModel = require("../../db/models/like");
//get all posts (not deleted)
const getAllPosts = (req, res) => {
  const _id = req.suha._id;

  userModel
    .findById(_id)
    .then((result) => {
      postModel.find({ puplisher: _id , isDele:false }).populate("puplisher").then((result) => {
      if(result){
        res.status(201).json(result);
      }
       
          else {
            res.status(404).json("There is no posts to show");
          }
        
      
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};
//get all posts (not deleted)
const allPosts = (req, res) => {

      postModel.find({isDele:false}).populate("puplisher").then((result) => {
        if (result) {
          res.status(201).json(result);
        } else {
          res.status(404).json("There is no posts to show");
        }
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
            .findOne({_id: id, isDele:false})
            .populate("puplisher like")
            .then((result) => {
              if (result){
          
                res.status(200).json(result);
             
            }else {
              res.status(404).json("There is no post for you");
            }
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
const deletePostAdmin = (req, res) => {
  try {
    const id = req.suha._id;
    const { _id } = req.params;
    userModel
      .findById({ _id: id })
      .then((result) => {
        if (result) {
          if (result.isDele) {
            res.status(404).json("user dose not exist");
          } else {
            postModel
              .findOneAndUpdate({ _id: _id, isDele: false }, { isDele: true })
              .then((result) => {
                commentModel
                  .updateMany(
                    { post: result._id, isDele: false },
                    { isDele: true },
                    { new: true }
                  )
                  .then((result) => {
                    commentModel
                      .updateMany(
                        { post: result._id, isDele: false },
                        { isDele: true },
                        { new: true }
                      )
                      .then((result) => {
                        likeModel
                          .updateMany(
                            { post: result._id, isDele: false },
                            { isDele: true }
                          )
                          .then(() => {
                            res.status(201).json("post deleted");
                            // res.status(201).json(result);
                          })
                          .catch((err) => {
                            res.status(400).json(err);
                          });
                      })
                      .catch((error) => {
                        res.status(400).json(error);
                      });
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              })
              .catch((err) => {
                res.status(400).json(err);
              });
          }
        } else {
          res.status(201).json("not found post");
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } catch (error) {
    res.status(400).json(error);
  }
};

const deletePost = (req, res) => {
  try {
    const id = req.suha._id;
    const { _id } = req.params;
    userModel
      .findById({_id:id})
      .then((result) => {
        if (result) {
   
            postModel
              .findOneAndUpdate(
                { _id: _id, isDele: false, puplisher: id },
                { isDele: true }
              )
              .then((result) => {
                if (result) {
        
                  commentModel
                    .updateMany(
                      { post: result._id, isDele: false },
                      { isDele: true },
                      { new: true }
                    )
                    .then((result) => {
                      commentModel
                        .updateMany(
                          { post: result._id, isDele: false },
                          { isDele: true },
                          { new: true }
                        )
                        .then((result) => {
                          likeModel
                            .updateMany(
                              { post: result._id, isDele: false },
                              { isDele: true }
                            )
                            .then(() => {
                              res.status(201).json("post deleted");
                              // res.status(201).json(result);
                            })
                            .catch((err) => {
                              res.status(400).json(err);
                            });
                        })
                        .catch((error) => {
                          res.status(400).json(error);
                        });
                    })
                    .catch((err) => {
                      res.status(400).json(err);
                    });
                } else {
                  res.status(404).json("not found post");
                }
              })
              .catch((err) => {
                res.status(400).json(err);
              });
          }

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
    const id = req.suha._id; //user
    const { _id } = req.params;//post
    const { avatar, discription, title } = req.body;//new data

    //avatar
    if (avatar) {
      userModel
        .findById({ _id: id })
        .then((result) => {          
          if(result){
            postModel
              .findOneAndUpdate(
                {post: _id , puplisher: id },
                { avatar: avatar},
                { new: true }
              )
              .then((result) => {
                if (result ){
                if (result.isDele == false) {
                  res.status(200).json(result);
                } else {
                  res.status(404).json("Post already deleted");
                }}
                else {
                  res.status(404).json("not found post ");
                }
              })
              .catch((err) => {
                res.status(400).json(err);
              });
            }else {
              res.status(404).json("not found user");
            }
  


        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }

    //discription
    if (discription) {
 
      userModel
        .findOne({_id:id})
        .then((result) => {
        
          if(result){
          postModel
            .findOneAndUpdate(
           
              {post: _id , puplisher: id },
              { discription: discription },
              { new: true }
            )
            .then((result) => {
              if (result ){
              if (result.isDele == false) {
                res.status(200).json(result);
              } else {
                res.status(404).json("Post already deleted");
              }}
              else {
                res.status(404).json("not found post ");
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
          }else {
            res.status(404).json("not found user");
          }



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
     
          if(result){
            postModel
              .findOneAndUpdate(
             
                {post: _id , puplisher: id },
                {title: title },
                { new: true }
              )
              .then((result) => {
                if (result ){
                if (result.isDele == false) {
                  res.status(200).json(result);
                } else {
                  res.status(404).json("Post already deleted");
                }}
                else {
                  res.status(404).json("not found post");
                }
              })
              .catch((err) => {
                res.status(400).json(err);
              });
            }else {
              res.status(404).json("not found user");
            }
  

        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  getAllPosts,
  getPost,
  addPost,
  deletePost,
  updatePost,
  deletePostAdmin,
  allPosts
};
