import mongoose from 'mongoose';

// Definindo o esquema para o modelo Post
const PostSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true // Remove espaços em branco antes e depois do título
  },
  content: { 
    type: String, 
    required: true, 
    trim: true // Remove espaços em branco antes e depois do conteúdo
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true // Adiciona campos de createdAt e updatedAt automaticamente
});

// Adicionando um índice para o campo `author` para melhorar a performance de consultas por autor
PostSchema.index({ author: 1 });

// Verifica se o modelo já existe antes de criar um novo
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post;
