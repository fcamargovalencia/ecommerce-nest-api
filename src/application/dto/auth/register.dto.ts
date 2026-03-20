import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../domain/enums/role.enum';

export class RegisterDto {
  @ApiProperty({ example: '12345678901' })
  @IsString()
  @IsNotEmpty()
  identificationNumber: string;

  @ApiProperty({ example: 'buyer@ecommerce.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'AES-256 encrypted password' })
  @IsString()
  @IsNotEmpty()
  encryptedPassword: string;

  @ApiProperty({ enum: Role, default: Role.BUYER })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
