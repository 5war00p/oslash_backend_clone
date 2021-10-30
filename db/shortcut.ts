import mongoose from "mongoose";

const ShortcutSchema = new mongoose.Schema(
  {
    // Requried Fields
    shortlink: {
      typer: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    // Non-required Fields
    description: {
      type: String,
    },

    tags: [
      {
        type: String,
      },
    ],

    // References
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

ShortcutSchema.pre("save", function (next) {
  if (this.isNew && this.shortlink) {
    this.shortlink = "o/" + this.shortlink;
  }
  next();
});

const Shortcut = mongoose.model("Shortcut", ShortcutSchema);
module.exports = Shortcut;
