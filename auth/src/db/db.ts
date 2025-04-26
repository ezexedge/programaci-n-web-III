import { DataSource, DataSourceOptions } from "typeorm";

class DBClass {
  private connection: DataSource;

  async connectDb(): Promise<DataSource> {

    const pgConfig = this.getPostgresConfig();

    const AppDataSource = new DataSource(pgConfig);

    this.connection = await AppDataSource.initialize();

    console.log("conecccccccc")
    return this.connection;
  }

  getConnection() {
    return this.connection;
  }

  getPostgresConfig() {
    const config: DataSourceOptions = {
      name: "default",
      type: "postgres",
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      synchronize: false,
      logging: false,
      entities: [`${__dirname}/../entity/**/*{.ts,.js}`],
      migrations: ["src/migration/**/*.ts"],
      subscribers: ["src/subscriber/**/*.ts"],
      schema: "public"
    };
    return config;
}

}
const db = new DBClass();
export default db;
