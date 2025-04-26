import { DataSource, DataSourceOptions } from "typeorm";

class DBClass {
  private connection: DataSource;

  async connectDb(): Promise<DataSource> {

    const pgConfig = this.getPostgresConfig();

    const AppDataSource = new DataSource(pgConfig);

    this.connection = await AppDataSource.initialize();

    return this.connection;
  }

  getConnection() {
    return this.connection;
  }

  getPostgresConfig() {
    const config: DataSourceOptions = {
      name: "default",
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "root",
      password: "root",
      database: "pgdocker",
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
