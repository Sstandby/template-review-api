import {
  Controller,
  Post,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductInput } from './inputs/product.input';
import { Company, Product } from '@prisma/client';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'The product has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async createProduct(@Body() productInput: ProductInput): Promise<Product> {
    return await this.productsService.create(productInput);
  }

  @Get(':productId/existing')
  @ApiResponse({ status: 200, description: 'Returns whether the product exists or not.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiParam({ name: 'productId', description: 'Product ID', type: String })
  async getExistingById(
    @Param('productId') productId: string,
  ): Promise<Boolean> {
    return this.productsService.getExistingById(productId);
  }

  @Post('company')
  @ApiResponse({ status: 201, description: 'The company has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiBody({ description: 'Company name', type: String })
  async createCompany(@Body('name') name: string): Promise<Company> {
    return await this.productsService.createCompany(name);
  }
}
