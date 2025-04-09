import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {UserService} from "../../Entities/user/user.service";
import {User} from "../../Entities/user/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly usersService:UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignore:false,
            secretOrKey:'secret'
        });
    }

    async validate(validationPayload : { username:string , id:string}) : Promise <User|null> {
        return this.usersService.getUserByUsername(validationPayload.username);
    }
}