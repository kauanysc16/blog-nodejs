import mongoose from "mongoose";

const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB já conectado.");
    return;
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar com o MongoDB:", error);
    throw new Error("Falha na conexão com o MongoDB");
  }
};

export default connectMongo;