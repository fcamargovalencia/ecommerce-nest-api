import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Min,
  Max,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({ example: 999.99 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    example: 'High performance laptop for gaming',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Dell', required: false })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ example: 'XPS 13', required: false })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({ example: 1.5, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  weight?: number;

  @ApiProperty({ example: 'Silver', required: false })
  @IsString()
  @IsOptional()
  color?: string;
}
