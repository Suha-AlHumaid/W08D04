const postModel = require("../../db/models/post");
const userModel = require("../../db/models/user");
const likeModel = require("../../db/models/like");

// like Toggel
const likeToggele = (req, res) => {
  try {
    const id = req.suha._id; //user
    const { _id } = req.params; //post
    userModel
      .findById({ _id: id })
      .then((result) => {//user
      
        likeModel
          .findByIdAndUpdate({post:_id },{puplisher:_id }, { isLike: true})
          .then((result) => {
            console.log(result);
            if (result) {
              if (result.isDele == false) {
                res.status(200).json(result.islike);
              } else {
                res.status(404).json("not found post");
              }
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

//create new comment
const addLike = (req, res) => {
  const id = req.suha._id;
  const { _id } = req.params; //post id
  userModel
    .findById(id) // find user
    .then((result) => {
   
      if (result) {
        if (result.isDele == false) {
  
          postModel
            .findById( _id) // find post
            .then((result) => {
                console.log(result);
              if (result) {
           
                if (result.isDele == false) {
             
                  const newlike = new likeModel({
                    isLike: true,
                    post: _id,
                    puplisher: result._id,
                  });

                  newlike.save();
                  console.log(newlike);
                  res.status(201).json(newlike);


                } else {
                  res.status(404).json("post dose not exist");
                }
              }
            });
        } else {
          res.status(404).json("user dose not exist");
        }
      } else {
        res.status(404).json("user dose not exist");
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

module.exports = { likeToggele, addLike };
