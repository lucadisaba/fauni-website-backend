import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Session,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { User } from './user.model';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { AuthService } from './auth.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('/whoami')
  whoAmI(@Session() session: any) {
    return this.userService.whoami(session.userId);
  }

  @Patch(':id')
  update(@Body() updateUserDto: UpdateUserDto, @Param('id') userId: string) {
    return this.userService.update(userId, updateUserDto);
  }
  @Post()
  addUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.addUser(createUserDto);
  }

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') userId: string): Promise<User> {
    return this.userService.getUserById(userId);
  }

  @Delete(':id')
  delete(@Param('id') userId: string) {
    return this.userService.delete(userId);
  }

  @Post('/logout')
  async logout(@Session() session: any) {
    session.userId = null;
  }

  @Post('/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signin(email, password);
    session.userId = user.id;
    console.log(session);
    return user;
  }
}
