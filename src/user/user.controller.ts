import { Controller, Get, Post, Body, Patch, Param, Delete, UnprocessableEntityException, HttpException, InternalServerErrorException, Logger, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserLoginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRegisterSchema } from './schemas/user.schema';
import { AppDataSource } from 'src/config/db.config';
import { User } from './entities/user.entity';
import bcrypt from "bcrypt";
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userService: UserService) { }

  @Post('register')
  async create(@Body() createUser: UserRegisterSchema) {
    return this.userService.create(createUser);
  }

  @Post('login')
  async login(@Body() userDto: UserLoginDto) {
    return this.userService.login(userDto);  
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
