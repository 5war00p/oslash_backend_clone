// Imports from packages
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Required Fields
    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    // Non-required Fields
    profile_image: {
      type: String,
    },

    last_login: {
      type: Date,
    },

    refresh_token: {
      type: String,
    },

    // References
    shortcuts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shortcut",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
