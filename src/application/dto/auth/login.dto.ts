import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'seller@ecommerce.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'AES-256 encrypted password' })
  @IsString()
  @IsNotEmpty()
  encryptedPassword: string;
}
