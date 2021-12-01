const express = require("express");
const app = express();
// const cors = require("cors");
const db = require("./db");

require("dotenv").config();

// app.use(cors());
app.use(express.json());

//Role Router
const roleRouter = require("./routers/routes/role");
app.use(roleRouter);

//User Router
const userRouter = require("./routers/routes/user");
app.use(userRouter);


//Post Router
// const postRouter = require("./routers/routes/post");
// app.use(postRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
