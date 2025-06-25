import jwt from 'jsonwebtoken';


export function verifyToken(req, res, next) {
  const token = req.session?.token || req.cookies?.token;
  console.log("xxxx",token)
  console.log("session",req.session)

 const secret =  process.env.JWT_SECRET || "your_secret_key"
  if (!token) {
    return res.status(401).json({ message: "Token no encontrado" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
}


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