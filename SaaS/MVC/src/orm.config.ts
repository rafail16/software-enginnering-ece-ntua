import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config: TypeOrmModuleOptions = {
    type:'postgres',
    port:5433,
    username: 'postgres',
    password: 'password',
    host: 'localhost',
    database:'saas50db',
    synchronize:true,
    entities: ["dist/**/*.entity{.ts,.js}"],
    logging:true,
        //'/**/*.entity{.ts,.js}'],
}