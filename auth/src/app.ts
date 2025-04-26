import express , {Express, NextFunction, Request} from "express"
import db from "./db/db";
import { DataSource } from "typeorm";

export default class App{
    public app: Express | null = null;
    
    public port = 2000
    
    public host = "0.0.0.0"

    public connection: DataSource;

    async run(){
        this.app = express();

        this.app.use(express.json());
        this.app.set("json spaces", 2);
        this.app.use(express.urlencoded({ extended: false }));

//        this.connection = await db.connectDb();
        console.log("conected")

this.app.listen(3000, '0.0.0.0', () => {
  console.log('Listening on port 3000!!');
});
    }
}

const app = new App()

app.run()

