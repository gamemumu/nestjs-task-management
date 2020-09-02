import { Injectable, ValidationPipe, UnauthorizedException, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ){}
    
    //สามารถสมัครสมาชิกได้
    async signUp(authCredentialsDto :AuthCredentialsDto){ 
        return this.userRepository.signUp(authCredentialsDto);
    }

    //มีระบบ Login
    async signIn(authCredentialsDto :AuthCredentialsDto): Promise<{accessToken: string}>{
        const username = await this.userRepository.validateuserPassword(authCredentialsDto);
        if(!username){
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);
        this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);
        return { accessToken };

    }

    //เรียกดู Profile ของตัวเอง
    async getProfile(user: User): Promise<User>{
        const username = await this.userRepository.getOwnProfile(user);
        if(!username){
            throw new UnauthorizedException('Invalid credentials');
        }

        return username;
    }
}
