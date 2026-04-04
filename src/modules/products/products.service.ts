import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entity/products.entity';
import { ProductType } from 'src/common/enums/product-type.enum';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductsRepository) {}

  private normalize(string: string): string {
    return string.trim().toLowerCase();
  }

  async createProduct(data: CreateProductDto): Promise<Product> {
    try {
      const normalizedName = this.normalize(data.name);

      return await this.productRepository.create({
        ...data,
        name: normalizedName,
      });
    } catch (error: any) {
      if (error.code === '23505') {
        throw new BadRequestException(
          `Product with name '${data.name}' already exists`,
        );
      }

      throw new InternalServerErrorException(
        'Unexpected error while creating product',
      );
    }
  }

  async updateProduct(id: number, data: UpdateProductDto): Promise<Product> {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      return await this.productRepository.patch(product, {
        ...data,
        ...(data.name !== undefined && { name: this.normalize(data.name) }),
      });
    } catch (error: any) {
      if (error.code === '23505') {
        throw new BadRequestException(
          `Product with name '${data.name}' already exists`,
        );
      }

      throw new InternalServerErrorException(
        'Unexpected error while updating product',
      );
    }
  }

  async findAll(pagination): Promise<{ data: Product[]; total: number }> {
    return this.productRepository.findAll(pagination);
  }

  async findByType(
    type: ProductType,
    pagination: PaginationDto,
  ): Promise<{ data: Product[]; total: number }> {
    return this.productRepository.findAllByType(type, pagination);
  }

  async findById(id: number): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async findByName(name: string): Promise<Product> {
    const product = await this.productRepository.findByName(
      this.normalize(name),
    );

    if (!product) {
      throw new NotFoundException(`Product with name '${name}' not found`);
    }

    return product;
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.productRepository.softDelete(id);

    if (!result.affected) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }
}
