import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { User } from './user.model';
import { UpdateUserDto } from 'src/dtos/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

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
}
