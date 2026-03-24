import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/products.entity';
import {
  DataSource,
  DeepPartial,
  DeleteResult,
  EntityManager,
  Repository,
} from 'typeorm';
import { ProductType } from 'src/common/enums/product-type.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  private getRepo(manager?: EntityManager): Repository<Product> {
    return manager ? manager.getRepository(Product) : this.productRepository;
  }

  async create(data: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create({
      ...data,
      price: data.price.toFixed(2),
    });
    return this.productRepository.save(newProduct);
  }

  async patch(product: Product, data: UpdateProductDto): Promise<Product> {
    const updateData: DeepPartial<Product> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.isTimeBased !== undefined)
      updateData.isTimeBased = data.isTimeBased;
    if (data.price !== undefined) updateData.price = data.price.toFixed(2);
    if (data.type !== undefined) updateData.type = data.type;

    const newProduct = this.productRepository.merge(product, updateData);
    return this.productRepository.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findAllByType(type: ProductType): Promise<Product[]> {
    return this.productRepository.find({ where: { type } });
  }

  async findById(id: number): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Product | null> {
    return this.productRepository.findOne({ where: { name } });
  }

  async softDelete(id: number): Promise<DeleteResult> {
    return this.productRepository.softDelete(id);
  }
}
