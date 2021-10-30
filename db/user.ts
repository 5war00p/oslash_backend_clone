import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Required Fields
    gmail: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    // Non-required Fields
    image_url: {
      type: String,
    },

    last_login: {
      type: Date,
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
