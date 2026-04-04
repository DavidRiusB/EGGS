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
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductType } from 'src/common/enums/product-type.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Roles(Role.Admin)
  @Get()
  async getAll(@Query() pagination: PaginationDto) {
    return this.productService.findAll(pagination);
  }

  @Roles(Role.Admin)
  @Get('by-type')
  async getByType(
    @Query('type', new ParseEnumPipe(ProductType)) type: ProductType,
    @Query()
    pagination: PaginationDto,
  ) {
    return this.productService.findByType(type, pagination);
  }

  @Roles(Role.Admin)
  @Get('by-name')
  async getByName(@Query('name') name: string) {
    return this.productService.findByName(name);
  }

  @Roles(Role.Admin)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findById(id);
  }

  @Roles(Role.Admin)
  @Post()
  async createProduct(@Body() data: CreateProductDto) {
    return this.productService.createProduct(data);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, data);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async softDelete(@Param('id', ParseIntPipe) id: number) {
    await this.productService.softDelete(id);
    return { message: 'Product deleted successfully' };
  }
}
