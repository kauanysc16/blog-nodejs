import jwt from 'jsonwebtoken';

export const jwtMiddleware = async (req, res, next) => {
  // Obter o token do header Authorization (Formato: "Bearer <token>")
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    // Verifica o token e extrai o payload (neste caso, o userId)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adiciona o userId ao objeto req
    next(); // Continua para o próximo middleware ou controlador
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }
};
