import { Injectable, BadRequestException } from '@nestjs/common';
import { DbService } from '@/common/db/db.service';
import { ProductInput } from './inputs/product.input';

@Injectable()
export class ProductsService {
  constructor(private readonly db: DbService) {}

  async getByProduct(id: string) {
    return await this.db.product.findUnique({
      where: {
        id,
      },
    });
  }

  async getExistingById(id: string) {
    const product = await this.getByProduct(id);
    if (!product) return false;
    return true;
  }

  async create(payload: ProductInput) {
    const product = await this.getByProduct(payload.id);
    if (product) {
      throw new BadRequestException('Product ID already exists');
    }

    const company = await this.getByCompany(payload.companyName);
    if (!company) {
      throw new BadRequestException('Company not exists');
    }

    return this.db.product.create({
      data: {
        id: payload.id,
        name: payload.name,
        description: payload.description,
        companyName: payload.companyName,
      },
    });
  }

  async createCompany(name: string) {
    const company = await this.getByCompany(name);
    if (company) {
      throw new BadRequestException('This company exists, please use another name.');
    }

    return this.db.company.create({
      data: {
        name,
      },
    });
  }

  async getByCompany(name: string) {
    return await this.db.company.findUnique({
      where: {
        name,
      },
    });
  }
}
