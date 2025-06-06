import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from 'cors';

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";
import { UserController, PostController, CommentController } from "./controllers/index.js";

mongoose
  .connect(
    "mongodb+srv://vladw239:Ql5qFv40uWV8Zh6z@hackathon06.neulmfj.mongodb.net/GitGud"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("err", err));

export const app = express(); 


//pentru procesarea fisierelor img
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
//pentru securitate
app.use(cors())


//  ZIP STORAGE 
const zipStorage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, "uploads/zips");
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const uploadZip = multer({
	storage: zipStorage,
	fileFilter: (req, file, cb) => {
	  if (file.mimetype === "application/zip" || file.mimetype === "application/x-zip-compressed") {
		 cb(null, true);
		} else {
			cb(new Error("Only .zip files are allowed"));
	  }
	},
});

app.use("/uploads/", express.static("uploads")); //pentru a pastra linkul deoparte de express si a nu asetpta vreun request  

app.post("/uploadZip", checkAuth, uploadZip.single("zip"), (req, res) => {
	res.json({ url: `/uploads/zips/${req.file.originalname}` });
 });
 




//UserAuthentification
app.post("/auth/login",  loginValidation,  handleValidationErrors,  UserController.login);
app.post("/auth/register",  registerValidation,  handleValidationErrors,  UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);


//PostsAuthentication
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

//posts and tags getters


app.get("/tags", PostController.getLastTags); 
app.get("/posts", PostController.getAll);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.get("/posts/:id/comments", PostController.getComments);
app.get("/tags/:tagName", PostController.getPostsWithTag)
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
app.post("/comment", checkAuth, CommentController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, PostController.update);
app.post("/posts/:id/fire", checkAuth, PostController.firePost);


//app server listen port
app.listen(4444, (err) => {
  if (err) {
    return console.log("err", err);
  }

  console.log("Server OK");
});
