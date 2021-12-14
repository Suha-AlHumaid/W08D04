const likeModel = require("../../db/models/like");
const postModel = require("../../db/models/post");

const getLikes = (req, res) => {
  const { id } = req.params; // id post
  likeModel
    .find({ post: id, isLike: true })
    .populate("puplisher")
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      console.log(error);
    });
};
const likeToggele = (req, res) => {
  const { id } = req.params; // post
  const { isLike } = req.body;
  const { _id } = req.suha; //user

  //if like true
  if (isLike) {
    likeModel
      .findOne({ post: id, puplisher: _id })
      .then((result) => {
        if (result) {
          likeModel
            .findOneAndUpdate(
              { post: id, puplisher: _id, isLike: false },
              { isLike: true },
              { new: true }
            )
            .then((result) => {
              if (result) {
                res.status(200).json(result);
              } else {
                res
                  .status(200)
                  .json({ isLike: true, post: id, puplisher: _id });
              }
            })
            .catch((err) => {
              console.log(err);
              res.status(400).json(err);
            });
        } else {
          const newLike = new likeModel({
            post: id,
            puplisher: _id,
          });

          newLike
            .save()
            .then((result) => {
              res.status(200).json(newLike);
            })
            .catch((error) => {
              res.status(400).json(error);
              console.log(error);
            });
        }
      })
      .catch((err) => {
        console.log("true", err);
        res.status(400).json(err);
      });
  } else {
    likeModel
      .findOneAndUpdate(
        { post: id, puplisher: _id, isLike: true },
        { isLike: false },
        { new: true }
      )
      .then((result) => {
        if (result) {
          res.status(200).json(result);
        } else {
          res.status(200).json({ post: id, puplisher: _id, isLike: false });
        }
      })
      .catch((error) => {
        console.log("false", error);
        res.status(400).json(error);
      });
  }
};

module.exports = { likeToggele, getLikes };
