import {
  Body,
  Controller,
  Delete,
  Get,
  Request,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
  Res,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { User } from './user.model';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserLoginDTO } from 'src/dtos/user-login.dto';

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
  addUser(@Body() createUserDto: CreateUserDto): Promise<string> {
    return this.userService.addUser(createUserDto);
  }

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() request) {
    return request.user;
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
  async authorize(@Req() req: Request, @Body() user: UserLoginDTO, @Res() res: Response): Promise<any> {
    const jwt = await this.authService.signin(user.email, user.password);
    res.setHeader('Authorization', 'Bearer ' + jwt.access_token);
    return res.json(jwt);
  }
}
