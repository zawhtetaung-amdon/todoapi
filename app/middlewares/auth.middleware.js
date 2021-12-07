import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      console.log("no authorization");
      return res.status(400).send({
        message: "Token Not Found",
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "secret");
    req.userData = decoded;
    next();
  } catch (error) {
    const err = new Error();
    err.message = "Token Expired.";
    err.status = 400;
    res.status(err.status).send({
      message: err.message || "Failed Authentication",
    });
  }
};
