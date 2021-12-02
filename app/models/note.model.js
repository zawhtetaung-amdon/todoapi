const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema(
  {
    title: String,
    content: String,
    completed: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", NoteSchema);
