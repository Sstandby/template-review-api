import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewInput {
  @ApiProperty({ description: 'Optional title of the review' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Rating of the review (must be an integer between 1 and 5)' })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Username of the reviewer' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'ID of the product being reviewed' })
  @IsString()
  @IsNotEmpty()
  productId: string;
}
