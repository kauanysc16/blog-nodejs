import jwt from 'jsonwebtoken';

export const jwtMiddleware = (req, res, next) => {
  // Obter o token do header Authorization (Formato: "Bearer <token>")
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido ou formato incorreto' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifica o token e extrai o payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adiciona o payload decodificado ao req.user (ex: { id, username, etc. })
    next(); // Continua para o próximo middleware ou controlador
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expirado' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Token inválido' });
    } else {
      return res.status(500).json({ message: 'Erro ao verificar o token' });
    }
  }
};