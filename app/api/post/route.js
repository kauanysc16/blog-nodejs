import Post from "@/models/Post";
import connectMongo from "@/utils/dbConnect";
import { middleware } from "@/utils/middleware";
import { NextResponse } from "next/server";

// Método GET - listar todas as postagens (não precisa de autenticação)
export async function GET(req) {
  await connectMongo();
  try {
    const posts = await Post.find().populate('author', 'username');
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Erro ao carregar postagens:', error); // Adicionado para depuração
    return NextResponse.json({ error: 'Erro ao carregar postagens' }, { status: 500 });
  }
}

// Método POST - criar uma nova postagem (precisa de autenticação)
export async function POST(req) {
  // Aplicando middleware para autenticação
  return middleware(req, async (req) => {
    await connectMongo();
    
    try {
      const { title, content } = await req.json();
      
      // Verifica se o título e o conteúdo foram fornecidos
      if (!title || !content) {
        return NextResponse.json({ error: 'Título e conteúdo são obrigatórios' }, { status: 400 });
      }
      
      const newPost = new Post({
        title,
        content,
        author: req.user.userId, // O userId está no token decodificado pelo middleware
      });
      await newPost.save();
      return NextResponse.json(newPost);
    } catch (error) {
      console.error('Erro ao criar postagem:', error); // Adicionado para depuração
      return NextResponse.json({ error: 'Erro ao criar postagem' }, { status: 500 });
    }
  });
}

// Método DELETE - deletar uma postagem (precisa de autenticação)
export async function DELETE(req) {
  // Aplicando middleware para autenticação
  return middleware(req, async (req) => {
    await connectMongo();
    
    try {
      const { id } = await req.json();
      
      // Verifica se o id da postagem foi fornecido
      if (!id) {
        return NextResponse.json({ error: 'ID da postagem é obrigatório' }, { status: 400 });
      }
      
      const post = await Post.findOneAndDelete({ _id: id, author: req.user.userId });
      if (!post) {
        return NextResponse.json({ error: 'Postagem não encontrada ou você não tem permissão para deletá-la' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Postagem deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar postagem:', error); // Adicionado para depuração
      return NextResponse.json({ error: 'Erro ao deletar postagem' }, { status: 500 });
    }
  });
}
