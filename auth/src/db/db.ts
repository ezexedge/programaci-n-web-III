import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "../entities/user.entity";
import bcrypt from "bcryptjs"; 
import { logger } from "../utils/logger";

class DBClass {
  private connection: DataSource;

  async connectDb(): Promise<DataSource> {
    const AppDataSource = new DataSource(this.getPostgresConfig());
    this.connection = await AppDataSource.initialize();
    logger.info("PostgreSQL connected successfully");
    return this.connection;
  }

  getConnection() {
    if (!this.connection) {
    logger.error("La conexión a la base de datos no ha sido inicializada. Llama primero a connectDb().");
    }
    return this.connection;
  }

  getPostgresConfig(): DataSourceOptions {
    const connectionUrl = process.env.DATABASE_URL;

    return {
      type: "postgres",
      url: connectionUrl,  
      synchronize: true,
      logging: false,
      entities: [`${__dirname}/../entities/**/*{.ts,.js}`],
      migrations: ["src/migration/**/*.ts"],
      subscribers: ["src/subscriber/**/*.ts"],
      schema: "public",
      extra: {
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      }
    };
  }

  hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };


  async initializeDatabase() {
    try {
        const userRepository = this.connection.getRepository(User);
        
        const existingUsersCount = await userRepository.count();
        
        if (existingUsersCount > 0) {
            logger.error(`Ya existen ${existingUsersCount} usuarios en la base de datos.`);
            return; 
        }
        
        const username = "admin";
        const email = "admin@example.com";
        const role = "admin";
        
        const hashedPassword = await bcrypt.hash("1234", 10);
        
        const newUser = userRepository.create({
            username,
            password: hashedPassword,
            email,
            role
        });
        
        await userRepository.save(newUser);
        
        logger.info(`Usuario ${username} creado exitosamente.`);
        logger.info("Inicialización de la base de datos completada con éxito.");
        
    } catch (error) {
        logger.error(`Error en inicialización de la base de datos:${error}`);
        throw new Error('Error al inicializar la base de datos');
    }
}

}

const db = new DBClass();
export default db;