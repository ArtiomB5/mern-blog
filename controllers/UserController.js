import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

export const register = async (request, response) => {
  try {
    const password = request.body.password;
    const salt = await bcrypt.genSalt(10); // encryption alghoritm
    const hash = await bcrypt.hash(password, salt); //encrypted password

    const doc = new UserModel({
      fullName: request.body.fullName,
      email: request.body.email,
      avatarUrl: request.body.avatarUrl,
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
    response.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Не удалось зарегистрироваться!",
    });
  }
};

export const login = async (request, response) => {
  try {
    const user = await UserModel.findOne({ email: request.body.email });

    if (!user) {
      console.log("Пользователь не найден");
      return response.status(400).json({
        message: "Не верный логин или пароль",
      });
    }

    const isValidPass = await bcrypt.compare(
      request.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      console.log("Не верный пароль");
      return response.status(400).json({
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

    response.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Не удалось авторизоваться!",
    });
  }
};

export const getMe = async (request, response) => {
  try {
    const user = await UserModel.findById(request.userId);
    if (!user) {
      return response.status(404).json({
        message: "Пользователь не найден 1",
      });
    }
    const { passwordHash, ...userData } = user._doc;

    return response.json({
      ...userData,
    });
  } catch (error) {
    console.log("----- ***** ----- ***** -----");
    console.log("/auth/me Error", error);
    console.log("----- ***** ----- ***** -----");
    return response.status(404).json({
      message: "Пользователь не найден 2",
    });
  }
};
