import Post from "@/models/Post";
import User from "@/models/User";
import connectMongo from "@/utils/dbConnect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Função GET - Listar postagens
export async function GET(req) {
  await connectMongo();

  try {
    const posts = await Post.find().populate('author', 'username'); // Popula o autor com o campo username
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Erro ao buscar postagens:", error);
    return NextResponse.json({ error: 'Erro ao buscar postagens' }, { status: 500 });
  }
}

// Função POST - Criar nova(s) postagem(ns)
export async function POST(req) {
  await connectMongo();

  try {
    const contentType = req.headers.get('content-type');
    console.log("Content-Type:", contentType);

    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type deve ser application/json' }, { status: 400 });
    }

    const requestBody = await req.json();
    console.log("Request Body:", requestBody);

    const posts = Array.isArray(requestBody) ? requestBody : [requestBody];
    const createdPosts = [];

    for (const post of posts) {
      const { title, content, author } = post;

      if (!title || !content) {
        return NextResponse.json({ error: 'Título e conteúdo são obrigatórios' }, { status: 400 });
      }

      // Validar o ID do autor
      let authorId;
      if (author && mongoose.Types.ObjectId.isValid(author._id)) {
        authorId = author._id;
      } else {
        authorId = 'default_author_id'; // Substitua com um ObjectId válido, se disponível
      }

      const newPost = new Post({
        title,
        content,
        author: authorId,
      });

      await newPost.save();
      createdPosts.push(newPost);
    }

    return NextResponse.json(createdPosts);
  } catch (error) {
    console.error("Erro ao criar postagem:", error);
    return NextResponse.json({ error: 'Erro ao criar postagem' }, { status: 500 });
  }
}