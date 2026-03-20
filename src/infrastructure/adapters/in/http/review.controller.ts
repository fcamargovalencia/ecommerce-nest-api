import { Controller, Get, Post, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewService } from '../../../../application/services/review.service';
import { CreateReviewDto } from '../../../../application/dto/review';
import { JwtAuthGuard } from '../../../security/jwt-auth.guard';
import { GetUser } from '../../../../common/decorators/get-user.decorator';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get reviews by product' })
  getByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewService.getByProduct(productId);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my reviews' })
  getMyReviews(@GetUser('userId') userId: number) {
    return this.reviewService.getMyReviews(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new review' })
  create(@GetUser('userId') userId: number, @Body() dto: CreateReviewDto) {
    return this.reviewService.create(userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete review' })
  delete(@Param('id', ParseIntPipe) id: number, @GetUser('userId') userId: number) {
    return this.reviewService.delete(id, userId);
  }
}
