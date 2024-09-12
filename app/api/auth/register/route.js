import User from "@/models/User";
import connectMongo from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Validação básica
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    await connectMongo();

    // Criação do novo usuário
    const user = new User({ username, email, password });
    await user.save();

    return NextResponse.json({ message: "Usuário registrado com sucesso!" }, { status: 201 });
  } catch (error) {
    console.error("Erro no registro:", error);  // Mostre o erro completo no console
    return NextResponse.json({ error: 'Erro ao registrar usuário', details: error.message }, { status: 500 });
  }
}