import mongoose, { Schema } from "mongoose";

export interface IUser {
  _id: string;
  email: string;
  role: "admin" | "user";
  clerkId: string;
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
