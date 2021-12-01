// const postModel = require("../../db/models/post");
// const userModel = require("../../db/models/user");


// //get all posts (not deleted)
// const getAllPosts = (req, res) => {
//   const _id = req.suha._id;

//   userModel
//     .findById({ _id })
//     .then((result) => {
//       postModel.find({ user: result._id }).then((result) => {
//         const filtered = result.filter((elem) => elem.isDele === false);
//         if (filtered.length !== 0) {
//           res.status(201).json(filtered);
//         } else {
//           res.status(404).json("There is no posts to show");
//         }
//       });
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// };

// //get post by id
// const getPost = (req, res) => {
//   const { id } = req.params;
//   const userId = req.suha._id;

//   userModel
//     .findById({ _id: userId })
//     .then((user) => {
//       if (user) {
//         postModel
//           .findById({ _id: id })
//           .then((result) => {
//             if (result.isDele === false) {
//               res.status(200).json(result);
//             }
//             res.status(404).json("There is no posts to show");
//           })
//           .catch((err) => {
//             res.status(400).json(err);
//           });
//       } else {
//         res.status(404).json("user dose not exist");
//       }
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// };

// //create new post
// const addPost = (req, res) => {
//   try {
//     const id = req.suha._id;
//     const { task } = req.body;

//     userModel.findById({ _id: id }).then((result) => {
//       if (result) {
//         const newPost = new postModel({
//           task,
//           user: result._id,
//         });
//         newTask.save();
//         res.status(201).json(newPost);
//       } else {
//         res.status(404).json("user dose not exist");
//       }
//     });
//   } catch {
//     console.error();
//   }
// };

// //soft delete post
// const deletePost = (req, res) => {
//   try {
//     const id = req.suha._id;
//     const { _id } = req.params;
//     userModel
//       .findById({ _id: id })
//       .then((result) => {
//         postModel
//           .findByIdAndUpdate({ _id }, { isDele: true })
//           .then((result) => {
//             console.log(result);
//             if (result.isDele == false) {
//               res.status(200).json(result);
//             } else {
//               res.status(404).json("Post already deleted");
//             }
//           })
//           .catch((err) => {
//             res.status(400).json(err);
//           });
//       })
//       .catch((err) => {
//         res.status(400).json(err);
//       });
//   } catch (error) {
//     res.status(400).json(error);
//   }
// };

// ////soft delete post
// const updatePost= (req, res) => {
//   try {
//     const id = req.suha._id;
//     const { _id } = req.params;
//     const { task } = req.body;
//     userModel
//       .findById({ _id: id })
//       .then((result) => {
//         postModel
//           .findByIdAndUpdate({ _id }, { task: task })
//           .then((result) => {
//             console.log(result);
//             if (result.isDele == false) {
//               res.status(200).json(result);
//             } else {
//               res.status(404).json("Post already deleted");
//             }
//           })
//           .catch((err) => {
//             res.status(400).json(err);
//           });
//       })
//       .catch((err) => {
//         res.status(400).json(err);
//       });
//   } catch (error) {
//     res.status(400).json(error);
//   }
// };
// module.exports = { getAllPosts, getPost, addPost, deletePost, updatePost };
// // avatar,
// // discriptionn,
// // title,
// // Date,
// // isDele,
// // puplisher,
// // like
