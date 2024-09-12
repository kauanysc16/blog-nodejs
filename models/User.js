import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Definindo o esquema para o modelo User
const UserSchema = new mongoose.Schema({
<<<<<<< HEAD
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true // Remove espaços em branco antes e depois do username
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, // Remove espaços em branco antes e depois do email
    lowercase: true, // Converte o email para minúsculas
    validate: {
      validator: (v) => /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(v), // Regex simples para validação de email
      message: (props) => `${props.value} não é um email válido!`
    }
  },
  password: { 
    type: String, 
    required: true 
  }
=======
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
>>>>>>> e15e309fb5759913246897e43c9c8521e6ba5d33
});

// Hash da senha antes de salvar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Passa o erro para o próximo middleware de erro
  }
});

// Método para comparar a senha
UserSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Erro ao comparar senhas');
  }
};

// Verifica se o modelo já existe antes de criar um novo
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
