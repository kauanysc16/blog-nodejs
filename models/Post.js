import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referência ao usuário
  createdAt: { type: Date, default: Date.now }, // Data de criação
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Usuário que avaliou
      stars: { type: Number, min: 1, max: 5 } // Avaliação de 1 a 5 estrelas
    }
  ],
  averageRating: { type: Number, default: 0 } // Média de avaliações
});

// Caso o modelo já exista, não o recriar
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
export default Post;