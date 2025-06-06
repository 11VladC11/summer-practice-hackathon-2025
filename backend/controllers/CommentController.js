import CommentModel from "../models/Comment.js";
import PostModel from "../models/Post.js";
export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      postId: req.body.postId,
    });

	 await doc.save();

	 
    PostModel.findOneAndUpdate(
      { _id: req.body.postId },
      { $inc: { commentsCount: 1 } },
      { returnDocument: "after" }
    )
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
      message: "Failed to create the comment",
    });
  }
};
 