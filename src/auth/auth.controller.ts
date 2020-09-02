import { Controller, Post, Body, ValidationPipe, Get, Query } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { GetUser } from './get-user-decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,){}
    
    //สามารถสมัครสมาชิกได้
    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto){
        return this.authService.signUp(authCredentialsDto);
    }

    //มีระบบ Login 
    @Post('/signIn')
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}>{
        return this.authService.signIn(authCredentialsDto);
    }

    //เรียกดู Profile ของตัวเอง
    @Get()
    getProfile(
        @GetUser() user: User,
    ){
        return this.authService.getProfile(user);
    }

    //เรียกดู Order history ของตัวเอง Go to orderHistory
   
}
