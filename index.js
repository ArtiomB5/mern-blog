import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import * as Validations from "./validations.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";
import { UserController, PostController } from "./controllers/index.js";

mongoose
  .connect(
    "mongodb+srv://dbUser:fOE5kCIF7P5wQT2m@cluster0.44kqpmj.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log(`DB-OK`))
  .catch((error) => console.log(`DB-ERROR`, error));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));
// if express js get request to uploads url express will return image from uploads

app.get("/", (request, response) => {
  response.send("Hello World 2!");
});

app.get("/auth/me", checkAuth, UserController.getMe);
app.post(
  "/auth/login",
  Validations.loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  Validations.registerValidation,
  handleValidationErrors,
  UserController.register
); // We use registerValidation for validate /auth/register request data

app.post(
  "/posts",
  checkAuth,
  Validations.postCreateValidation,
  PostController.create
); // Create one post - Create/CRUD
app.get("/posts/:id", PostController.getOne); // Get one post by id - Read/CRUD
app.get("/posts", PostController.getAll); // Get all posts - Read/CRUD
app.patch(
  "/posts/:id",
  checkAuth,
  Validations.postCreateValidation,
  PostController.update
); // Update one post by id - Update/CRUD
app.delete("/posts/:id", checkAuth, PostController.remove); // Delete one post by id - Delete/CRUD

app.post("/upload", checkAuth, upload.single("image"), (request, response) => {
  response.json({
    url: `/uploads/${request.file.originalname}`,
  });
});

app.listen(4444, (error) => {
  if (error) {
    console.log(error);
  }

  console.log("Server OK");
});
