import { DbService } from '@/common/db/db.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReviewInput } from './inputs/review.input';
import { CommentInput } from './inputs/comment.input';
import { UserInput } from './inputs/user.input';
import { Review, Comment } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private readonly db: DbService) {}

  async getRatingDistribution(
    productId: string,
  ): Promise<{ [key: string]: number }> {
    const product = await this.db.product.findFirst({
      where: {
        id: productId,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID '${productId}' not found`);
    }

    const reviews = await this.db.review.groupBy({
      by: ['rating'],
      _count: {
        rating: true,
      },
      where: {
        productId: productId,
      },
    });

    const totalReviews = reviews.reduce(
      (acc, curr) => acc + curr._count.rating,
      0,
    );

    const distributionPercentage: { [key: string]: number } = {};
    for (let i = 1; i <= 5; i++) {
      const ratingCount = reviews.find((item) => item.rating === i);
      const percentage = ratingCount
        ? (ratingCount._count.rating / totalReviews) * 100
        : 0;
      distributionPercentage[i.toString()] = Math.round(percentage);
    }

    return distributionPercentage;
  }

  async getReviews(
    productId: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<Review[]> {
    const reviews = await this.db.review.findMany({
      where: {
        productId: productId,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    if (!reviews || reviews.length === 0) {
      throw new NotFoundException(
        `Reviews for product with id '${productId}' not found`,
      );
    }

    return reviews;
  }

  async getComment(
    productId: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<Comment[]> {
    const comment = await this.db.comment.findMany({
      where: {
        productId: productId,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    if (!comment || comment.length === 0) {
      throw new NotFoundException(
        `Comments for product with id '${productId}' not found`,
      );
    }

    return comment;
  }

  async create(payload: ReviewInput) {
    const data = {
      author: payload.username,
      productId: payload.productId,
      rating: payload.rating,
    };
    const product = await this.db.product.findFirst({
      where: {
        id: payload.productId,
      },
    });
    const user = await this.getUser(payload.username);

    if (!product) throw new BadRequestException('Product not found');
    if (!user) throw new BadRequestException('User not found');

    const existingReview = await this.db.review.findFirst({
      where: {
        productId: payload.productId,
        author: payload.username,
      },
    });

    if (existingReview) {
      try {
        await this.db.review.update({
          where: { id: existingReview.id },
          data: {
            title: payload.title || existingReview.title,
            rating: payload.rating,
          },
        });

        return await this.db.review.findUnique({
          where: { id: existingReview.id },
        });
      } catch (error) {
        throw new BadRequestException('Unable to update review');
      }
    }

    if (payload.title) {
      data['title'] = payload.title;
    }

    try {
      return await this.db.review.create({ data });
    } catch (error) {
      throw new BadRequestException('Unable to create review');
    }
  }
  async createComment(payload: CommentInput) {
    const user = await this.getUser(payload.username);

    if (!user) {
      payload.username = (
        await this.createUser({ username: payload.username })
      ).username;
    }
    try {
      return await this.db.comment.create({
        data: {
          text: payload.text,
          author: payload.username,
          productId: payload.productId,
        },
      });
    } catch (error) {
      throw new BadRequestException('Unable to create comment');
    }
  }

  async createUser(payload: UserInput) {
    const user = await this.getUser(payload.username);
    if (user)
      throw new BadRequestException(
        'This user has already been created, please use another username',
      );

    return await this.db.user.create({ data: payload });
  }

  async getUser(username: string): Promise<Boolean> {
    const user = await this.db.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      return false;
    }

    return true;
  }
}
