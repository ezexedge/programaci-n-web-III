import express, { Express } from "express";
import db from "./db/db";
import { DataSource } from "typeorm";
import Route from "./routes";
import { logger } from "./utils/logger";
import cookieParser from 'cookie-parser';
import cors from "cors"
export default class App {
  public app: Express | null = null;
  public port =  3000;
  public host = "0.0.0.0";
  public connection: DataSource;
  public routes: Route;

  async run() {
    this.app = express();

    this.app.set("trust proxy", true);

    this.app.use(express.json());
    this.app.set("json spaces", 2);
    this.app.use(express.urlencoded({ extended: false }));

this.app.use(cookieParser());

this.app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);


    this.connection = await db.connectDb();
    await db.initializeDatabase();

    this.routes = new Route();
    await this.routes.main(this.app);

    this.app.listen(this.port, this.host, () => {
      logger.info(`Listening on port ${this.port}!!`);
    });
  }
}

const app = new App();
app.run();
