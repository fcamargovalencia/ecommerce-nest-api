import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PersonalInfoDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    example: '1990-01-01',
    type: 'string',
    format: 'date',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;
}
