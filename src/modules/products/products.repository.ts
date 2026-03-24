import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/products.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProductsRepository {
  constructor() {}
}
