import multer from "multer";
import path from "path";
import fs from "fs";

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../uploads");
    console.log("dir dir", dir);
    if (!fs.existsSync(dir)) {
      console.log("shi");
      fs.mkdirSync(dir);
    }
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    console.log("file name", file.originalname);
    cb(null, file.originalname);
  },
});

const profileUpload = multer({
  storage: profileStorage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);
    console.log(ext, "extension");

    // if (ext !== ".jpg") {
    //   return cb(new Error("Only JPG File is allowed"));
    // }
    cb(null, true);
  },
}).single("profile_img");

export { profileUpload };
