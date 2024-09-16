import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stars: { type: Number, required: true }
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ratings: [ratingSchema],
  averageRating: { type: Number, default: 0 }
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export default Post;