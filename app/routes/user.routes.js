import { checkAuth } from "../middlewares/auth.middleware";

module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  app.post("/users/register", users.register);

  app.post("/users/login", users.login);

  app.put("/users/edit/:userId", checkAuth, users.edit);

  app.get("/users/detail/:userId", checkAuth, users.detail);
};
