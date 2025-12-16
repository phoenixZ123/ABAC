import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { OperatorPosition, UserRole } from "src/type/type";

export class CreateUserSchema {
    @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
    @IsNotEmpty()
    @IsString()
    name!: string;

    @ApiProperty({ description: 'Email of the user', example: 'john@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @ApiProperty({ description: 'Password of the user', example: 'strongpassword' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password!: string;

    @ApiPropertyOptional({ description: 'Role of the user', enum: UserRole, example: UserRole.USER })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiPropertyOptional({ description: 'Position of the user', enum: UserRole, example: "manager" })
    @IsOptional()
    @IsEnum(OperatorPosition)
    position?: OperatorPosition;

}

export class UserLoginSchema {
    @ApiProperty({ description: 'Email of the user', example: 'john@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @ApiProperty({ description: 'Password of the user', example: 'strongpassword' })
    @IsNotEmpty()
    @IsString()
    password!: string;
}


export class UpdateUserSchema extends PartialType(CreateUserSchema) {
    @ApiPropertyOptional({ description: 'The name of the user', example: 'John Doe' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'Email of the user', example: 'john@example.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ description: 'Password of the user', example: 'strongpassword' })
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;

    @ApiPropertyOptional({ description: 'Role of the user', enum: UserRole, example: UserRole.USER })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

}

