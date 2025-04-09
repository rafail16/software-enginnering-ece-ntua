import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {UserService} from "../Entities/user/user.service";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {APIController} from "../API/api.controller";
import {AuthController} from "./auth.controller";
import {UserModule} from "../Entities/user/user.module";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {LocalStategy} from "./strategies/local.stategy";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [
      JwtModule.register({
        secret: 'secret',
        signOptions:{expiresIn:'3600s'}
      }),
      UserModule,
      PassportModule.register({defaultStrategy:'jwt'}),
      HttpModule],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,LocalStategy],
  exports: [JwtModule]
})
export class AuthModule {}
