import { checkAuth } from "../middlewares/auth.middleware";

module.exports = (app) => {
  const notes = require("../controllers/note.controller.js");

  // Create a new Note
  app.post("/notes", checkAuth, notes.create);

  // Retrieve all Notes
  app.get("/notes", checkAuth, notes.findAll);

  // Retrieve a single Note with noteId
  app.get("/notes/:noteId", checkAuth, notes.findOne);

  // Update a Note with noteId
  app.put("/notes/:noteId", checkAuth, notes.update);
  app.put("/notes-update/:noteId", checkAuth, notes.updatewhole);

  // Delete a Note with noteId
  app.delete("/notes/:noteId/:userId", checkAuth, notes.delete);
};
