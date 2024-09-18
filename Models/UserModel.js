import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1529589574731-3c3eb55d8b76?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGUlMjBwaG90byUyMGR1bW15fGVufDB8fDB8fHww",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User",Schema)
export default User