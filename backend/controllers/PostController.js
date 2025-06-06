import PostModel from "../models/Post.js";
import Comment from "../models/Comment.js";
import { json, text } from "express";
import { body } from "express-validator";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tagsTheme)
      .flat()
      .slice(0, 5);
    res.json(tags);
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: "Failed to get the articles",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("user")
      .exec();
    res.json(posts);
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: "Failed to get the articles",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: "after" }
    )
      .populate("user")
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: "Article not found",
          });
        }
        res.json(doc);
      })
      .catch((err) => {
        console.log("Error:", err);
        return res.status(500).json({
          message: "Failed to get the article",
        });
      });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: "Failed to get the articles",
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ postId }).populate("user");
    res.json(comments);
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: "Failed to get the commments",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndDelete({ _id: postId })
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: "Article not found",
          });
        }
        res.json({ success: true });
      })
      .catch((err) => {
        console.log("Error:", err);
        return res.status(500).json({
          message: "Failed to delete the article",
        });
      });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: "Failed to delete the article",
    });
  }
};

export const create = async (req, res) => {
  try {
    const { title, text, tagsTheme, imageUrl, zipUrl } = req.body;

    const doc = new PostModel({
      title: title,
      text: text,
      user: req.userId,
      imageUrl: imageUrl,
      zipUrl: zipUrl || "", // ← include zipUrl here
      tagsTheme: tagsTheme ? tagsTheme.split(",") : [],
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: "Failed to create the article",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, text, tagsTheme, imageUrl, zipUrl } = req.body;

    // If you split tags on the front end, tagsTheme might be a string or array.
    // In our example, we passed tagsTheme as a comma‐string "tag1,tag2,tag3",
    // so we split it here if needed.
    const tagsArray =
      typeof tagsTheme === "string"
        ? tagsTheme
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : Array.isArray(tagsTheme)
        ? tagsTheme
        : [];

    const updatedDoc = await PostModel.findByIdAndUpdate(
      postId,
      {
        title,
        text,
        tagsTheme: tagsArray,
        imageUrl: imageUrl || "",
        zipUrl: zipUrl || "",
      },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(updatedDoc);
  } catch (err) {
    console.error("Error in PostController.update:", err);
    res.status(500).json({ message: "Failed to update the article" });
  }
};
export const getPostsWithTag = async (req, res) => {
  const { tagName } = req.params;
  try {
    const posts = await PostModel.find({ tagsTheme: tagName }).populate("user");
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const firePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await PostModel.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.fireUsers.includes(userId)) {
      return res.status(400).json({ message: "Already reacted" });
    }

    post.fireUsers.push(userId);
    post.fireCount += 1;
    await post.save();

    res.json({ fireCount: post.fireCount });
  } catch (err) {
    console.error("Error in firePost:", err);
    res.status(500).json({ message: "Failed to add fire" });
  }
};
 