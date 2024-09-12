import User from "@/models/User";
import connectMongo from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
<<<<<<< HEAD
    // Conectando ao banco de dados MongoDB
    await connectMongo();
    
    // Obtendo dados do corpo da requisição
    const { username, email, password } = await request.json();
    
    // Criando um novo usuário
=======
    // Parseia o JSON do corpo da requisição
    const { username, email, password } = await request.json();

    // Valida se os campos estão presentes
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' }, 
        { status: 400 }
      );
    }

    // Conecta ao MongoDB
    await connectMongo();

    // Cria um novo usuário e salva no banco de dados
>>>>>>> e15e309fb5759913246897e43c9c8521e6ba5d33
    const user = new User({ username, email, password });
    
    // Salvando o usuário no banco de dados
    await user.save();
<<<<<<< HEAD
    
    // Retornando uma resposta de sucesso
=======

    // Retorna uma resposta de sucesso
>>>>>>> e15e309fb5759913246897e43c9c8521e6ba5d33
    return NextResponse.json({ message: 'Usuário registrado com sucesso!' });

  } catch (error) {
<<<<<<< HEAD
    // Adicionando logs para depuração (opcional)
    console.error('Erro ao registrar usuário:', error);
    
    // Retornando uma resposta de erro
    return NextResponse.json({ error: 'Erro ao registrar usuário' }, { status: 400 });
=======
    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json(
      { error: 'Erro ao registrar usuário' }, 
      { status: 500 }
    );
>>>>>>> e15e309fb5759913246897e43c9c8521e6ba5d33
  }
}
