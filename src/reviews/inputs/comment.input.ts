import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentInput {
  @ApiProperty({ description: 'Text of the comment' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ description: 'Username of the comment author' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'ID of the product being reviewed' })
  @IsString()
  @IsNotEmpty()
  productId: string;
}
