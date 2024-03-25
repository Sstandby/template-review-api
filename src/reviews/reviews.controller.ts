import {
  Controller,
  Post,
  Body,
  BadRequestException,
  NotFoundException,
  Param,
  Query,
  Get,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewInput } from './inputs/review.input';
import { CommentInput } from './inputs/comment.input';
import { Comment, Review } from '@prisma/client';
import { UserInput } from './inputs/user.input';
import {
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('product/:productId')
  @ApiParam({ name: 'productId', description: 'Product ID', type: String })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns reviews for the specified product.',
  })
  async getReviewsByProductId(
    @Param('productId') productId: string,
    @Query('page') page: number = 1,
  ): Promise<Review[]> {
    return await this.reviewsService.getReviews(productId, page);
  }

  @Get('comments/:productId')
  @ApiParam({ name: 'productId', description: 'Product ID', type: String })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns comments for the specified product.',
  })
  async getCommentsByProductId(
    @Param('productId') productId: string,
    @Query('page') page: number = 1,
  ): Promise<Comment[]> {
    return await this.reviewsService.getComment(productId, page);
  }

  @Get(':productId/rating-distribution')
  @ApiParam({ name: 'productId', description: 'Product ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Returns rating distribution for the specified product.',
  })
  async getRatingDistribution(
    @Param('productId') productId: string,
  ): Promise<{ [key: string]: number }> {
    return await this.reviewsService.getRatingDistribution(productId);
  }

  @Post()
  @ApiBody({ type: ReviewInput })
  @ApiResponse({
    status: 201,
    description: 'The review has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async createReview(@Body() reviewInput: ReviewInput): Promise<Review> {
    return await this.reviewsService.create(reviewInput);
  }

  @Post('comment')
  @ApiBody({ type: CommentInput })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async createComment(@Body() commentInput: CommentInput) {
    return await this.reviewsService.createComment(commentInput);
  }

  @Post('user')
  @ApiBody({ type: UserInput })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async createUser(@Body() userInput: UserInput) {
    return await this.reviewsService.createUser(userInput);
  }
}
