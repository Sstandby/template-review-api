import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './common/db/db.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [DbModule, ReviewsModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
