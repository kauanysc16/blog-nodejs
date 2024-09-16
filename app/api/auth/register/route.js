import User from "@/models/User"; // Importa o modelo Mongoose para usuários
import connectMongo from "@/utils/dbConnect"; // Importa a função para conectar ao banco de dados MongoDB
import { NextResponse } from "next/server"; // Importa o NextResponse para construir a resposta HTTP

/**
 * Função para lidar com requisições POST, normalmente para registro de novos usuários.
 * @param {Request} request - Objeto de requisição da API.
 * @returns {NextResponse} - Resposta HTTP com mensagem de sucesso ou erro.
 */
export async function POST(request) {
  try {
    // Extrai o corpo da requisição e desestrutura os campos necessários
    const body = await request.json();
    const { username, email, password } = body;

    // Validação básica: verifica se todos os campos necessários estão presentes
    if (!username || !email || !password) {
      // Retorna um erro se algum campo estiver faltando
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    // Conectar ao banco de dados MongoDB
    await connectMongo();

    // Criação de um novo usuário com os dados fornecidos
    const user = new User({ username, email, password });

    // Salva o novo usuário no banco de dados
    await user.save();

    // Retorna uma mensagem de sucesso e o status HTTP 201 (Criado)
    return NextResponse.json({ message: "Usuário registrado com sucesso!" }, { status: 201 });
  } catch (error) {
    // Registra o erro no console para depuração
    console.error("Erro no registro:", error);

    // Retorna uma mensagem de erro com o status HTTP 500 (Erro Interno do Servidor)
    return NextResponse.json({ error: 'Erro ao registrar usuário', details: error.message }, { status: 500 });
  }
}
