import { DataSource, DataSourceOptions } from "typeorm";

class DBClass {
  private connection: DataSource;

  async connectDb(): Promise<DataSource> {
    const AppDataSource = new DataSource(this.getPostgresConfig());
    this.connection = await AppDataSource.initialize();
    console.log("PostgreSQL connected successfully");
    return this.connection;
  }

  getConnection() {
    return this.connection;
  }

  getPostgresConfig(): DataSourceOptions {
    const connectionUrl = process.env.DATABASE_URL;

    return {
      type: "postgres",
      url: connectionUrl,  
      synchronize: false,
      logging: false,
      entities: [`${__dirname}/../entity/**/*{.ts,.js}`],
      migrations: ["src/migration/**/*.ts"],
      subscribers: ["src/subscriber/**/*.ts"],
      schema: "public",
      extra: {
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      }
    };
  }
}

const db = new DBClass();
export default db;