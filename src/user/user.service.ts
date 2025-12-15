import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, Logger, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto, UserLoginDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AppDataSource } from 'src/config/db.config';
import { User } from './entities/user.entity';
import { UserRegisterSchema } from './schemas/user.schema';
import bcrypt from "bcrypt";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from "@nestjs/jwt";
import { UserRole } from 'src/type/type';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly jwtService: JwtService

  ) { }
  /**
   * 
   * @param userDto - user register data
   * @returns - user data
   */
  async create(userDto: UserRegisterSchema) {
    try {
      if (!userDto) {
        throw new UnprocessableEntityException({
          success: false,
          message: "Some fields are required."
        })
      }
      const exists = await this.userRepo.findBy({ email: userDto.email })
      if (exists.length > 0) {
        throw new ConflictException('Email already registered');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userDto.password, 8);
      // Replace password in DTO
      userDto.password = hashedPassword;

      const data = this.userRepo.create(userDto);
      const user = await this.userRepo.save(data);
      return {
        success: true,
        message: "User Register Successfully",
        user
      };
    } catch (err: any) {
      this.logger.error('Error registering user', err);
      if (err instanceof HttpException) {
        throw err; // ✅ Keep original status code and message
      }
      throw new InternalServerErrorException({ success: false, message: 'Error registering user' + err });
    }
  }

  async login(userLogin: UserLoginDto) {
    try {
      const user = await this.userRepo.findOne({ where: { email: userLogin.email } });
      if (!user) {
        throw new UnprocessableEntityException({
          success: false,
          message: "User Data Not Found"
        })
      }
      const isMatch = await bcrypt.compare(userLogin.password, user.password);

      if (!isMatch) {
        throw new UnprocessableEntityException('Invalid email or password');
      }
      const payload = { id: user.id, role: user.role, position: user.position };
      const token = await this.jwtService.signAsync(payload);
      return {
        success: true,
        message: "User Login Successfully",
        user,
        token
      };
    } catch (error: any) {
      this.logger.error('Error Login user', error);
      if (error instanceof HttpException) {
        throw error; // ✅ Keep original status code and message
      }
      throw new InternalServerErrorException({ success: false, message: 'Error login user' + error });
    }


  }

  async findAll(authUser) {
    try {
      if (!authUser) throw new BadRequestException('User info missing');

      const [user,total] = await this.userRepo.findAndCount(); // returns all users
      console.log(user);
      return {
        success: true,
        message: "Get User List Successfully",
        user,total
      }
    } catch (error: any) {
      this.logger.error('Error Get All Users', error);

      if (error instanceof HttpException) {
        throw error; // Keep original status code and message
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Error Get All Users: ' + error.message,
      });
    }
  }



  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
