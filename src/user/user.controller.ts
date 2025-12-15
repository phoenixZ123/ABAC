import { Controller, Get, Post, Body, Patch, Param, Delete, UnprocessableEntityException, HttpException, InternalServerErrorException, Logger, ConflictException, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserLoginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRegisterSchema } from './schemas/user.schema';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { UserGuard } from 'src/common/guards/user.guard';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userService: UserService) { }

  @Get('list')
  // @UseGuards(JwtAuthGuard)
  async findAll(@Req() req) {
    console.log("user :",req.user);
    return  this.userService.findAll();
  }

  @Post('register')
  async create(@Body() createUser: UserRegisterSchema) {
    return this.userService.create(createUser);
  }

  @Post('login')
  async login(@Body() userDto: UserLoginDto) {
    return this.userService.login(userDto);
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
