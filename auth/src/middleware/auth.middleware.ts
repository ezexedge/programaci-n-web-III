// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;
console.log("XCVCVC",req.cookies)
  if (!token) {
    res.status(403).json({ message: 'Token requerido' });
    return;
  }

  const secretKey = process.env.JWT_SECRET || 'your_secret_key';

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};



  export const authorizeRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(403).json({ message: 'Autenticación requerida' });
        return;
      }

      console.log("roless",roles)
      console.log("req.user.role",req.user.role)
  
      if (!roles.includes(req.user.role)) {
        res.status(403).json({ message: 'Acceso no autorizado' });
        return;
      }
  
      next();
    };
  };
  