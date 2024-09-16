import Post from "@/models/Post"; // Importa o modelo Mongoose para postagens
import connectMongo from "@/utils/dbConnect"; // Importa a função para conectar ao banco de dados MongoDB
import { NextResponse } from "next/server"; // Importa o NextResponse para construir a resposta HTTP
import jwt from "jsonwebtoken"; // Importa a biblioteca para manipulação de JSON Web Tokens (JWT)

/**
 * Função para lidar com requisições GET para buscar todas as postagens.
 * @param {Request} req - Objeto de requisição da API.
 * @returns {NextResponse} - Resposta HTTP com a lista de postagens.
 */
export async function GET(req) {
  // Conectar ao banco de dados MongoDB
  await connectMongo();

  try {
    // Busca todas as postagens, exclui o campo `createdAt` e popula o campo `author` com o `username`
    const posts = await Post.find()
                            .select('-createdAt') // Exclui o campo `createdAt` das postagens retornadas
                            .populate('author', 'username'); // Popula o campo `author` com o `username` do autor
    return NextResponse.json(posts); // Retorna as postagens como resposta em formato JSON
  } catch (error) {
    // Registra o erro no console para depuração
    console.error("Erro ao buscar postagens:", error);
    // Retorna uma mensagem de erro com o status HTTP 500 (Erro Interno do Servidor)
    return NextResponse.json({ error: 'Erro ao buscar postagens' }, { status: 500 });
  }
}

/**
 * Função para lidar com requisições POST para criar uma nova postagem.
 * @param {Request} req - Objeto de requisição da API.
 * @returns {NextResponse} - Resposta HTTP com a nova postagem criada ou uma mensagem de erro.
 */
export async function POST(req) {
  // Conectar ao banco de dados MongoDB
  await connectMongo();

  try {
    // Verificar o cabeçalho Content-Type
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Retorna um erro se o Content-Type não for application/json
      return NextResponse.json({ error: 'Content-Type deve ser application/json' }, { status: 400 });
    }

    // Pega o corpo da requisição (dados do formulário)
    const requestBody = await req.json();
    const { title, content, token } = requestBody; // Extrai título, conteúdo e token do corpo da requisição

    // Validação básica: verifica se título e conteúdo estão presentes
    if (!title || !content) {
      // Retorna um erro se título ou conteúdo estiverem faltando
      return NextResponse.json({ error: 'Título e conteúdo são obrigatórios' }, { status: 400 });
    }

    // Validação básica: verifica se o token foi fornecido
    if (!token) {
      // Retorna um erro se o token não for fornecido
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
    }

    let user;

    try {
      // Decodifica o token JWT para verificar o usuário
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = decoded; // O token contém o `userId` ou `username`
    } catch (error) {
      // Trata erros de token expirado ou inválido
      if (error.name === 'TokenExpiredError') {
        return NextResponse.json({ error: 'Token expirado' }, { status: 403 });
      } else if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
      } else {
        // Retorna um erro genérico se houver um problema ao verificar o token
        return NextResponse.json({ error: 'Erro ao verificar o token' }, { status: 500 });
      }
    }

    // Criação de uma nova postagem com o autor associado ao token
    const newPost = new Post({
      title,
      content,
      author: user.userId // Assume que o `userId` está no token JWT
    });

    // Salva a nova postagem no banco de dados
    await newPost.save();

    // Retorna a nova postagem criada como resposta em formato JSON
    return NextResponse.json(newPost);
  } catch (error) {
    // Registra o erro no console para depuração
    console.error("Erro ao criar postagem:", error);
    // Retorna uma mensagem de erro com o status HTTP 500 (Erro Interno do Servidor)
    return NextResponse.json({ error: 'Erro ao criar postagem' }, { status: 500 });
  }
}
