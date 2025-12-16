import { Controller, Get, Post, Body, Patch, Param, Delete, UnprocessableEntityException, HttpException, InternalServerErrorException, Logger, ConflictException, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { UserGuard } from 'src/common/guards/user.guard';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { CreateUserSchema, UpdateUserSchema, UserLoginSchema } from './schemas/user.schema';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userService: UserService) { }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req) {
    return this.userService.findAll(req.user);
  }

  @Post('register')
  async create(@Body() createUser: CreateUserSchema) {
    return this.userService.create(createUser);
  }

  @Post('login')
  async login(@Body() userDto: UserLoginSchema) {
    return this.userService.login(userDto);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string,
    @Body() updateUserDto: UpdateUserSchema,
    @Req() req) {
    return this.userService.update(id, updateUserDto, req.user);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string,@Req ()req) {
    return this.userService.remove(id,req.user);
  }
}
