import User from "@/models/User";
import connectMongo from "@/utils/dbConnect";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    await connectMongo();

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error); // Adicionado para debugging
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 400 });
  }
}
