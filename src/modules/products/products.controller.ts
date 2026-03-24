import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductType } from 'src/common/enums/product-type.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  async getAll() {
    return this.productService.findAll();
  }

  @Get('by-type')
  async getByType(
    @Query('type', new ParseEnumPipe(ProductType))
    type: ProductType,
  ) {
    return this.productService.findByType(type);
  }

  @Get('by-name')
  async getByName(@Query('name') name: string) {
    return this.productService.findByName(name);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findById(id);
  }

  @Post()
  async createProduct(@Body() data: CreateProductDto) {
    return this.productService.createProduct(data);
  }

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, data);
  }

  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    await this.productService.softDelete(id);
    return { message: 'Product deleted successfully' };
  }
}
