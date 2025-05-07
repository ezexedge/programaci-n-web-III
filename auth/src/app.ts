import express, { Express } from "express";
import db from "./db/db";
import { DataSource } from "typeorm";
import Route from "./routes";
import { logger } from "./utils/logger";

export default class App {
    public app: Express | null = null;
    public port = 2000;
    public host = "0.0.0.0";
    public connection: DataSource;
    public routes: Route;

    async run() {
        this.app = express();

        this.app.use(express.json());
        this.app.set("json spaces", 2);
        this.app.use(express.urlencoded({ extended: false }));
        
        this.connection = await db.connectDb();
        await db.initializeDatabase();
        
        this.routes = new Route(); 
        await this.routes.main(this.app);

        this.app.listen(3000, '0.0.0.0', () => {
            logger.info('Listening on port 3000!!');
        });
    }
}

const app = new App();
app.run();