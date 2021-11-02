// Imports from packages
import mongoose from "mongoose";

const ShortcutSchema = new mongoose.Schema(
  {
    // Requried Fields
    shortlink: {
      type: String,
      unique: true,
      required: true,
    },

    url: {
      type: String,
      unique: true,
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

ShortcutSchema.index({ description: 1, tags: 1, shortlink: 1, url: 1 });

ShortcutSchema.pre("save", function (next) {
  if (this.isNew && this.shortlink) {
    this.shortlink = "o/" + this.shortlink;
  }
  next();
});

const Shortcut = mongoose.model("Shortcut", ShortcutSchema);
module.exports = Shortcut;
