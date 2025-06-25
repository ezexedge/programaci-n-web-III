import { User } from "../entities/user.entity";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { DataSource } from "typeorm";
import db from "../db/db";

type Role = 'admin' | 'subscriber';
type AuthResponse = {
  success: boolean;
  message?: string;
  user?: Partial<User>;
  token?: string;
};

export default class AuthService {
    private readonly connection: DataSource;
    private readonly SECRET_KEY: string;
    private readonly validRoles: Role[];
    
    constructor() {
        this.connection = db.getConnection();
        this.SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
        this.validRoles = ['admin', 'subscriber'];
    }


    async signup(username: string, password: string, email: string, role = 'subscriber'): Promise<AuthResponse> {
        try {
            const userRepository = this.connection.getRepository(User);

            const existingUser = await userRepository.findOne({ where: { username } });
            if (existingUser) {
                return {
                    success: false,
                    message: 'El nombre de usuario ya está en uso'
                };
            }
            
            const existingEmail = await userRepository.findOne({ where: { email } });
            if (existingEmail) {
                return {
                    success: false,
                    message: 'El email ya está registrado'
                };
            }
            

            
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const newUser = userRepository.create({
                username,
                password: hashedPassword,
                email,
                role: role || 'subscriber'
            });
            
            await userRepository.save(newUser);
            
            return {
                success: true,
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    role: newUser.role
                }
            };
        } catch (error) {
            console.error('Error en servicio de registro:', error);
            throw new Error('Error al registrar usuario');
        }
    }

  
    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const userRepository = this.connection.getRepository(User);
            
            const user = await userRepository.findOne({ where: { email } });
            if (!user) {
                return {
                    success: false,
                    message: 'Usuario o contraseña incorrectos'
                };
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: 'Usuario o contraseña incorrectos'
                };
            }

            const token = jwt.sign(
                { 
                    id: user.id, 
                    username: user.username, 
                    email: user.email,
                    role: user.role 
                }, 
                this.SECRET_KEY, 
                { expiresIn: '1h' }
            );

            return {
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                token
            };
        } catch (error) {
            console.error('Error en servicio de login:', error);
            throw new Error('Error al iniciar sesión');
        }
    }
    

    verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.SECRET_KEY);
        } catch (error) {
            throw new Error('Token inválido');
        }
    }
}