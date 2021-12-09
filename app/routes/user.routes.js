import { checkAuth } from "../middlewares/auth.middleware";

module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  app.post("/users/register", users.register);

  app.post("/users/login", users.login);

  app.get("/users/detail/:userId", checkAuth, users.detail);
};
