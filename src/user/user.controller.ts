import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Post() 
    addUser(@Body() createUserDto: CreateUserDto): Promise<any> {
        return this.userService.addUser(createUserDto);
    }
}
