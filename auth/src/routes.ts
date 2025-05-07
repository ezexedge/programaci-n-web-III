// src/Route.ts
import express, { Router, Express, Request, Response, NextFunction } from "express";
import AuthController from "./controllers/AuthController";
import { authorizeRole, verifyToken } from "./middleware/auth.middleware";
import validateRequest from "./middleware/validateRequest.middleware";
import { signupValidate } from "./validations";
import { rateLimiter } from "./middleware/ratelimiter.middleware";

export default class Route{

    public controller: AuthController;
    public router: Router;

    constructor(){
        this.controller = new AuthController();
        this.router = express.Router();
    }

    async main(app: Express): Promise<void>{

        this.router.post(
            "/signup",
            validateRequest(signupValidate),
            async (req: Request, res: Response, next: NextFunction) => {
                await this.controller.signup(req, res).catch((e) => next(e));
            },
        );
        

        this.router.post(
            "/login",
            rateLimiter.applyLoginLimit(),
            async (req: Request, res: Response, next: NextFunction) => {
                await this.controller.login(req, res).catch((e) => next(e));
            },
        );

        this.router.get(
            "/admin",
            verifyToken,
            authorizeRole(['admin']),
            async (req: Request, res: Response, next: NextFunction) => {
                await this.controller.admin(req, res).catch((e) => next(e));
            }
        );


        this.router.get(
            "/subscriber",
            verifyToken,
            authorizeRole(['admin','subscriber']),
            async (req: Request, res: Response, next: NextFunction) => {
                await this.controller.subscriber(req, res).catch((e) => next(e));
            }
        );
        
        
        app.use("/auth", this.router);

    }
}