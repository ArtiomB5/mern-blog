import mongoose from "mongoose";

// Here we create User Model from MVC Pattern
// create data-base table schema
// fullName will be required string
// email will be required and unique string
// passwordHash will be encrypted and required string
// avatarUrl will be optional string
// every new user creates with timestamp
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      unique: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // type of user _id from mongoDB
      ref: "User", // link to user Model. It's 2 data base tables relationship
      required: true,
    },
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", PostSchema);
