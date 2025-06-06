import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      maxlength: 280,
      default: "",
      trim: true,
    },
    location: {
      city: { type: String },
    },
    badges: {
      type: [String],
      default: [],
    },
    avatarUrl: String,

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const badgeCatalog = [
  {
    code: "NOVICE",
    name: "Novice Coder",
    iconUrl: "/badges/novice.svg",
    threshold: 0,
  },
  {
    code: "JUNIOR",
    name: "Junior Developer",
    iconUrl: "/badges/junior.svg",
    threshold: 3,
  },
  {
    code: "EXPERT",
    name: "Expert",
    iconUrl: "/badges/expert.svg",
    threshold: 6,
  },
  {
    code: "MASTER",
    name: "Master",
    iconUrl: "/badges/master.svg",
    threshold: 10,
  },
  {
    code: "LEGEND",
    name: "Legend",
    iconUrl: "/badges/legend.svg",
    threshold: 20,
  },
];

UserSchema.virtual("scaledBadge").get(function () {
  const count = Array.isArray(this.posts) ? this.posts.length : 0;
  let tier = {
    code: "NONE",
    name: "No Badge",
    iconUrl: "/badges/none.svg",
    threshold: 0,
  };

  for (const level of badgeCatalog) {
    if (count >= level.threshold) tier = level;
    else break;
  }
  return tier;
});

export default mongoose.model("User", UserSchema);
