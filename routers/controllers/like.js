const likeModel = require("../../db/models/like");

const likeToggele = (req, res) => {
  const { id } = req.params;
  const { isLike } = req.body;
  const { _id } = req.suha;
  if (isLike) {
    likeModel
      .findOne({ post: id, puplisher: _id })
      .then((result) => {
        console.log(result);
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
                res.status(404).json("no post");
              }
            })
            .catch((err) => {
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
              res.status(200).json(result);
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        }
      })
      .catch((err) => {
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
          res.status(404).json("not found post");
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
};

module.exports = { likeToggele };
