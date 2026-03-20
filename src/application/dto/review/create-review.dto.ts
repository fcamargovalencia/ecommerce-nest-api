import { IsNumber, IsString, IsNotEmpty, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  productId: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @ApiProperty({ example: 'Great product, highly recommend!' })
  @IsString()
  @IsNotEmpty()
  comment: string;
}
