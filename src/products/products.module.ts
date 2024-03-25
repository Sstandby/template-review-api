import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DbModule } from '@/common/db/db.module';

@Module({
  imports: [DbModule],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
