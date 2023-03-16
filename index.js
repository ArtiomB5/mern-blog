import express from "express";
import mongoose from "mongoose";

import * as Validations from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

mongoose
  .connect(
    "mongodb+srv://dbUser:fOE5kCIF7P5wQT2m@cluster0.44kqpmj.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log(`DB-OK`))
  .catch((error) => console.log(`DB-ERROR`, error));

const app = express();

app.use(express.json());

app.get("/", (request, response) => {
  response.send("Hello World 2!");
});

app.get("/auth/me", checkAuth, UserController.getMe);
app.post("/auth/login", Validations.loginValidation, UserController.login);
app.post(
  "/auth/register",
  Validations.registerValidation,
  UserController.register
); // We use registerValidation for validate /auth/register request data

app.post("/posts", PostController.create); // Create one post - Create/CRUD
// app.get("/posts", PostController.getAll); // Get all posts - Read/CRUD
// app.get("/posts/:id", PostController.getOne); // Get one post by id - Read/CRUD
// app.patch("/posts/:id", PostController.update); // Update one post by id - Update/CRUD
// app.delete("/posts/:id", PostController.remove); // Delete one post by id - Delete/CRUD

app.listen(4444, (error) => {
  if (error) {
    console.log(error);
  }

  console.log("Server OK");
});
