import { NextFunction, Request, Response } from "express";
import AuthService from "../services/AuthService";

export default class AuthController {
    private service: AuthService;

    constructor() {
        this.service = new AuthService();
    }

    async signup(req: Request, res: Response, next?: NextFunction) {
        try {
            const { username, password, email, role } = req.body;
          
            if (!username || !password || !email) {
                return res.status(400).json({ 
                    error: true, 
                    message: 'Usuario, contraseña y email son requeridos' 
                });
            }
      
            const result = await this.service.signup(username, password, email, role);
          
            if (!result.success) {
                return res.status(400).json({ 
                    error: true, 
                    message: result.message 
                });
            }
          
            return res.status(201).json({ 
                success: true,
                message: 'Usuario creado exitosamente',
                user: result.user
            });
        } catch (error) {
            console.error("Error en signup controller:", error);
            return res.status(500).json({
                error: true,
                message: 'Error interno del servidor'
            });
        }
    }
    
    async login(req: Request, res: Response, next?: NextFunction) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({
                    error: true,
                    message: 'email y contraseña son requeridos'
                });
            }
            
            const result = await this.service.login(email, password);
            
            if (!result.success) {
                return res.status(401).json({
                    error: true,
                    message: result.message
                });
            }
            
            return res.status(200).json({
                success: true,
                message: 'Inicio de sesión exitoso',
                user: result.user,
                token: result.token
            });
        } catch (error) {
            console.error("Error en login controller:", error);
            return res.status(500).json({
                error: true,
                message: 'Error interno del servidor'
            });
        }
    }

    async admin(req: Request, res: Response, next?: NextFunction){
        res.json({ message: 'Bienvenido, administrador' });
    }

    async subscriber(req: Request, res: Response, next?: NextFunction){
        res.json({ message: 'Bienvenido, subscriber' });
    }
}