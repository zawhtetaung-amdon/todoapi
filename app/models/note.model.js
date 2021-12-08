const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const NoteSchema = mongoose.Schema(
  {
    title: String,
    content: String,
    completed: Boolean,
    userId: {
      type: ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", NoteSchema);
