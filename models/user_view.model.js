import mongoose from "mongoose";

// Recently Viewed Schema
const recentlyViewedSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // references the User model
    required: true,
    unique: true,
  },
  recently_viewed: [
    {
      article_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article", //references the Article model
        required: true,
      },
      viewed_at: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],
});
const RecentlyViewed = mongoose.model("RecentlyViewed", recentlyViewedSchema);

export default RecentlyViewed;
