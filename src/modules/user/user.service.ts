import { BadRequestException, ConflictException, ForbiddenException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { AppDataSource } from 'src/config/db.config';
import { User } from './entities/user.entity';
import bcrypt from "bcrypt";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from "@nestjs/jwt";
import { OperatorPosition, UserRole } from 'src/type/type';
import { CreateUserSchema, UpdateUserSchema, UserLoginSchema } from './schemas/user.schema';
import { Operator } from '../operator/entities/operator.entity';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Operator) private operatorRepo: Repository<Operator>,
    private readonly jwtService: JwtService

  ) { }
  /**
   * 
   * @param userDto - user register data
   * @returns - user data
   */
  async create(userDto: CreateUserSchema) {
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
      if (userDto.role === 'operator') {
        const operator = this.operatorRepo.create({
          name: user.name,
          email: user.email,
          position: userDto.position, // default or from DTO
          user: user, // link to saved user
        });
        await this.operatorRepo.save(operator);
      }
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
  /**
   * 
   * @param userLogin - user login email and password
   * @returns - user data
   */
  async login(userLogin: UserLoginSchema) {
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
      const payload = { id: user.id, role: user.role, position: user.operator?.position };
      if (user.role === 'operator') {
        const operator = await this.operatorRepo.findOne({
          where: { user: { id: user.id } },
          select: ['id', 'position'],
          relations: ['user'], // <<< IMPORTANT
        });
        payload.position = operator?.position;
      }
      // console.log("user payload:", payload);
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
  /**
   * 
   * @param authUser - authentication
   * @returns - user data
   */
  async findAll(authUser) {
    try {
      if (!authUser) throw new BadRequestException('User info missing');

      let result;

      // switch (authUser.role) {
      //   case 'admin':
      //     // Admin can see all accounts
      //     result = await this.userRepo.findAndCount();
      //     break;
      //   case 'user':
      //     result = await this.userRepo.findAndCount({ where: { role: UserRole.USER } });
      //     break;
      //   case 'operator':
      //     break;
      //   default:
      //     throw new ForbiddenException('Forbidden error');
      // }
      result = await this.userRepo.findAndCount({ where: { role: UserRole.OPERATOR } });

      const [user, total] = result;
      return {
        success: true,
        message: `Get ${authUser.role} List Successfully`,
        user,
        total
      };

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
  /**
   * 
   * @param id - update user id
   * @param updateUserData - update user data
   * @param authUser - authentication
   * @returns - updated data
   */
  async update(id: string,
    updateUserData: UpdateUserSchema, authUser): Promise<User | any> {
    try {
      if (!id || !updateUserData) {
        throw new UnprocessableEntityException('User fields required'); // 422
      }

      switch (authUser.role) {
        case 'user':
          // Users can only update their own record
          if (authUser.id !== id) {
            throw new ForbiddenException('You can only update your own account'); // 403
          }

          // Optional: Prevent users from updating restricted fields
          if (updateUserData.role) {
            throw new ForbiddenException('You cannot change role or position'); // 403
          }

          // Perform the update
          await this.userRepo.update({ id }, updateUserData);

          // Fetch and return the updated user
          const updatedUser = await this.userRepo.findOne({
            where: { id },
            select: ['id', 'name', 'email', 'password', 'role', 'created_at', 'updated_at'], // exclude sensitive fields
          });

          return {
            success: true,
            message: 'User Updated Successfully',
            user: updatedUser,
          };

        default:
          throw new ForbiddenException('Only users can update their own data'); // 403
      }
    } catch (error: any) {
      this.logger.error('Error Update Users', error);

      if (error instanceof HttpException) {
        throw error; // Keep original status code and message
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Error Update Users: ' + error.message,
      });
    }
  }

  async remove(id: string, authUser) {
    try {
      if (!id) {
        throw new UnprocessableEntityException('User ID is required'); // 422
      }

      switch (authUser.role) {
        case 'user':
          // deactivate deletion acount
          if (authUser.id !== id) {
            throw new ForbiddenException('You can only delete your own account');
          }
          break;

        case 'operator':

          const user = await this.userRepo.findOne({ where: { id } });
          if (!user) {
            throw new NotFoundException('User not found');
          }
          // Optional: restrict which roles operator can delete
          if (user.role !== 'user') {
            throw new ForbiddenException('Operators can only delete users');
          }
          break;

        case 'admin':
          // Admin can delete anyone, no restriction
          break;

        default:
          throw new ForbiddenException('Invalid role');
      }

      // Perform deletion
      const deleteResult = await this.userRepo.delete({ id });

      if (deleteResult.affected === 0) {
        throw new NotFoundException('User not found');
      }

      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error: any) {
      this.logger.error('Error Delete User', error);
      if (error instanceof HttpException) {
        throw error; // Keep original status code and message
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Error Delete User: ' + error.message,
      });
    }

  }
}
