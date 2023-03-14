import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

import { registerValidation } from "./validations/auth.js";
import UserModel from "./models/User.js";
import checkAuth from "./utils/checkAuth.js";

mongoose
  .connect(
    "mongodb+srv://dbUser:fOE5kCIF7P5wQT2m@cluster0.44kqpmj.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log(`DB-OK`))
  .catch((error) => console.log(`DB-ERROR`, error));

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World 2!");
});

app.get("/auth/me", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден 1",
      });
    }
    const { passwordHash, ...userData } = user._doc;

    return res.json({
      ...userData,
    });
  } catch (err) {
    console.log("----- ***** ----- ***** -----")
    console.log("/auth/me Error", err)
    console.log("----- ***** ----- ***** -----")
    return res.status(404).json({
      message: "Пользователь не найден 2",
    });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      console.log("Пользователь не найден");
      return res.status(400).json({
        message: "Не верный логин или пароль",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      console.log("Не верный пароль");
      return res.status(400).json({
        message: "Не верный логин или пароль",
      });
    }

    // create JWT token
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось авторизоваться!",
    });
  }
});

// We use registerValidation for validate /auth/register request data
app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10); // encryption alghoritm
    const hash = await bcrypt.hash(password, salt); //encrypted password

    const doc = new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const { passwordHash, ...userData } = user._doc;

    // create JWT token
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    // returns created user data and token
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось зарегистрироваться!",
    });
  }
});

app.listen(4444, (err) => {
  if (err) {
    console.log(err);
  }

  console.log("Server OK");
});
