import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(403).json({ message: 'Token requerido' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET || 'your_secret_key';

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(403).json({ message: 'Autenticación requerida' });
      return;
    }

    console.log("roless", roles);
    console.log("req.user.role", req.user.role);

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Acceso no autorizado' });
      return;
    }

    next();
  };
};