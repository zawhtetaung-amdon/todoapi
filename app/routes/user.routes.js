import { checkAuth } from "../middlewares/auth.middleware";
import { profileUpload } from "../middlewares/upload.middleware";

module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  app.post("/users/register", users.register);

  app.post("/users/login", users.login);

  app.put(
    "/users/edit/:userId",
    checkAuth,
    function (req, res, next) {
      profileUpload(req, res, (err) => {
        if (err) {
          console.log(err);
          res.status(400).json({
            message: err,
          });
        } else {
          next();
        }
      });
    },
    users.edit
  );

  app.get("/users/detail/:userId", checkAuth, users.detail);
};
