const Note = require("../models/note.model.js");
const User = require("../models/user.model.js");
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

// Create and Save a new Note
exports.create = (req, res) => {
  // Validate request
  if (!req.body.content) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }
  User.findOne({ _id: ObjectId(req.body.userId) })
    .then((user) => {
      if (!user) {
        return res.status(400).send({
          message: "Wrong UserId",
        });
      }
      // Create a Note
      const note = new Note({
        title: req.body.title || "Untitled Note",
        content: req.body.content,
        completed: req.body.completed,
        userId: req.body.userId,
      });

      // Save Note in the database
      note
        .save()
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while creating the Note.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Note.",
      });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
  Note.find({
    userId: ObjectId(req.query.userId),
  })
    .then((notes) => {
      res.send(notes);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notes.",
      });
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
  Note.findOne({
    _id: ObjectId(req.params.noteId),
    userId: ObjectId(req.body.userId),
  })
    .then((note) => {
      if (!note) {
        return res.status(404).send({
          message: "Note not found with id " + req.params.noteId,
        });
      }
      res.send(note);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Note not found with id " + req.params.noteId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving note with id " + req.params.noteId,
      });
    });
};

// Check List
exports.update = (req, res) => {
  Note.findOne({
    _id: ObjectId(req.params.noteId),
    userId: ObjectId(req.body.userId),
  }).then((note) => {
    if (!note) {
      return res.status(404).send({
        message: "Note not found with id " + req.params.noteId,
      });
    }
    Note.findByIdAndUpdate(
      req.params.noteId,
      {
        // title: req.body.title || "Untitled Note",
        // content: req.body.content,
        completed: !note.completed,
      },
      { new: true }
    )
      .then((note) => {
        if (!note) {
          return res.status(404).send({
            message: "Note not found with id " + req.params.noteId,
          });
        }
        res.send(note);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Note not found with id " + req.params.noteId,
          });
        }
        return res.status(500).send({
          message: "Error updating note with id " + req.params.noteId,
        });
      });
  });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
  Note.findOneAndRemove({
    _id: ObjectId(req.params.noteId),
    userId: ObjectId(req.params.userId),
  })
    .then((note) => {
      if (!note) {
        return res.status(404).send({
          message: "Note not found with id " + req.params.noteId,
        });
      }
      res.send({ message: "Note deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Note not found with id " + req.params.noteId,
        });
      }
      return res.status(500).send({
        message: "Could not delete note with id " + req.params.noteId,
      });
    });
};

// Update a note identified by the noteId in the request
exports.updatewhole = (req, res) => {
  // Validate Request
  if (!req.body.content) {
    return res.status(400).send({
      message: "Note content can not be empty",
    });
  }

  // Find note and update it with the request body
  Note.findOneAndUpdate(
    {
      _id: ObjectId(req.params.noteId),
      userId: ObjectId(req.body.userId),
    },
    {
      title: req.body.title || "Untitled Note",
      content: req.body.content,
      completed: req.body.completed,
    },
    { new: true }
  )
    .then((note) => {
      if (!note) {
        return res.status(404).send({
          message: "Note not found with id test" + req.params.noteId,
        });
      }
      res.send(note);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Note not found with id " + req.params.noteId,
        });
      }
      return res.status(500).send({
        message: "Error updating note with id " + req.params.noteId,
      });
    });
};
