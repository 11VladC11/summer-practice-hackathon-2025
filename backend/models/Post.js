import mongoose, { Schema } from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tagsTheme: {
      type: Array,
      default: [],
    },
    imageUrl: {
      type: String,
    },
    zipUrl: {
      type: String,
      default: "",
    },
    fireCount: { type: Number, default: 0 },
    fireUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", PostSchema);
