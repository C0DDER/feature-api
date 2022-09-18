import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// TODO use env variables
export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'features',
  autoLoadEntities: true,
  synchronize: true,
};
