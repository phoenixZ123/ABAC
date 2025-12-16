import { IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OperatorRegisterDto {
    @ApiProperty({ description: 'Full name of the operator', example: 'Jane Doe' })
    @IsEmpty()
    @IsString()
    name?: string;

    @ApiProperty({ description: 'Email address', example: 'operator@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ description: 'Password for the operator account', example: 'strongPassword123' })
    @IsNotEmpty()
    @IsString()
    password!: string;

    @ApiProperty({ description: 'Department role of the operator', example: 'Dispatch' })
    @IsOptional()
    @IsString()
    role?: string;
}
