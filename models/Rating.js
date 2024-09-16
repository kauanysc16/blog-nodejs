import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stars: { type: Number, required: true, min: 1, max: 5 }, // Avaliação entre 1 e 5 estrelas
  createdAt: { type: Date, default: Date.now }
});

const Rating = mongoose.models.Rating || mongoose.model('Rating', RatingSchema);
export default Rating;