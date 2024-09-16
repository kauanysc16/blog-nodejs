import User from "@/models/User"; // Importa o modelo de usuário
import connectMongo from "@/utils/dbConnect"; // Importa a função para conectar ao banco de dados MongoDB
import { NextResponse } from "next/server"; // Importa o NextResponse para enviar respostas HTTP
import jwt from "jsonwebtoken"; // Importa a biblioteca jsonwebtoken para geração e verificação de tokens JWT

/**
 * Função para lidar com requisições POST, normalmente para login de usuário.
 * @param {Request} request - Objeto de requisição da API.
 * @returns {NextResponse} - Resposta HTTP com o token JWT ou mensagem de erro.
 */
export async function POST(request) {
  // Extrai email e senha do corpo da requisição
  const { email, password } = await request.json();
  
  // Conectar ao banco de dados MongoDB
  await connectMongo();

  try {
    // Verificar se o usuário com o email fornecido existe no banco de dados
    const user = await User.findOne({ email });
    if (!user) {
      // Retorna um erro se o usuário não for encontrado
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    // Verifica se a senha fornecida está correta
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      // Retorna um erro se a senha estiver incorreta
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    // Gerar um token JWT para autenticação, contendo o ID do usuário
    const token = jwt.sign(
      { userId: user._id }, // Payload com o ID do usuário
      process.env.JWT_SECRET, // Segredo para assinar o token (deve estar configurado no ambiente)
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    // Retorna o token JWT em uma resposta JSON
    return NextResponse.json({ token });
    
  } catch (error) {
    // Registra o erro no console e retorna uma mensagem de erro
    console.error('Erro ao fazer login:', error);
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 400 });
  }
}
