const express = require("express");
const cors = require("cors");

const db = require("./db");
const bodyParser = require('body-parser');
app.use(cors());

const passport = require("passport");
const session = require("express-session");
const authRoutes = require("./routers/routes/auth");
require("dotenv").config();
require("./routers/middlewares/passport");
const app = express();
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());


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
