const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db");
const bodyParser = require('body-parser');
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Role Router
const roleRouter = require("./routers/routes/role");
app.use(roleRouter);

//User Router
const userRouter = require("./routers/routes/user");
app.use(userRouter);


// Post Router
const postRouter = require("./routers/routes/post");
app.use(postRouter);

//Comment Router

const commentRouter = require("./routers/routes/comment");
app.use(commentRouter);


// Like Router

const likeRouter = require("./routers/routes/like");
app.use(likeRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
