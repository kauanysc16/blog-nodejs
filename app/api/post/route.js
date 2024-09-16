import Post from "@/models/Post";
import connectMongo from "@/utils/dbConnect";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  await connectMongo();

  try {
    const posts = await Post.find()
                            .select('-createdAt') // Exclui o campo `createdAt`
                            .populate('author', 'username');
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Erro ao buscar postagens:", error);
    return NextResponse.json({ error: 'Erro ao buscar postagens' }, { status: 500 });
  }
}

export async function POST(req) {
  await connectMongo();

  try {
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type deve ser application/json' }, { status: 400 });
    }

    // Pega o corpo da requisição (dados do formulário)
    const requestBody = await req.json();
    const { title, content, token } = requestBody;  // O token agora está no corpo da requisição

    if (!title || !content) {
      return NextResponse.json({ error: 'Título e conteúdo são obrigatórios' }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
    }

    let user;

    try {
      // Decodifica o token JWT para verificar o usuário
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = decoded; // O token contém o `userId` ou `username`
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return NextResponse.json({ error: 'Token expirado' }, { status: 403 });
      } else if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
      } else {
        return NextResponse.json({ error: 'Erro ao verificar o token' }, { status: 500 });
      }
    }

    // Criação de uma nova postagem com o autor associado ao token
    const newPost = new Post({
      title,
      content,
      author: user.userId  // Assume que o `userId` está no token JWT
    });

    await newPost.save();

    return NextResponse.json(newPost);
  } catch (error) {
    console.error("Erro ao criar postagem:", error);
    return NextResponse.json({ error: 'Erro ao criar postagem' }, { status: 500 });
  }
}