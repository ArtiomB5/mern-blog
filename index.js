import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

import { registerValidation } from "./validations/auth";

mongoose
  .connect(
    "mongodb+srv://dbUser:<fOE5kCIF7P5wQT2m>@cluster0.44kqpmj.mongodb.net/?retryWrites=true&w=majority"
  )
  .then((resp) => console.log(`DB-OK`, resp))
  .catch((error) => console.log(`DB-ERROR`, error));

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World 2!");
});

app.post("/auth/login", (req, res) => {
  const token = jwt.sign(
    {
      email: req.body.email,
    },
    "tokenSecretKey"
  ); //generate new token

  res.json({
    success: true,
    token,
  });
  //   console.log("REQ_body", req.body);
});

// We use registerValidation for validate /auth/register request data
app.post("/auth/register", registerValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  res.json({
    success: true,
  });
});

app.listen(4444, (err) => {
  if (err) {
    console.log(err);
  }

  console.log("Server OK");
});
