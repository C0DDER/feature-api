import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostEntity } from "../post/post.entity";

// TODO use env variables
export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'features',
  entities: [PostEntity],
  synchronize: true,
};
