module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  app.post("/users/register", users.register);

  app.post("/users/login", users.login);
};
