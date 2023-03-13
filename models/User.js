import mongoose from "mongoose";

// Here we create User Model from MVC Pattern
// create data-base table schema
// fullName will be required string
// email will be required and unique string
// passwordHash will be encrypted and required string
// avatarUrl will be optional string
// every new user creates with timestamp
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
