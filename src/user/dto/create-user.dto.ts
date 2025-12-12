import { IsEmail, IsEnum, IsString } from "class-validator";

export class CreateUserDto {

    @IsString()
    name?: string;

    @IsEmail()
    email: string;

    @IsString()
    password?: string;

    @IsString()
    role?: string;

    @IsString()
    position?:string;

}
export class UserLoginDto{
    @IsEmail()
    email:string;

    @IsString()
    password:string;
}
