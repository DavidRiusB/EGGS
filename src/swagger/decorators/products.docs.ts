// src/swagger/decorators/products.docs.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProductType } from 'src/common/enums/product-type.enum';
import { CreateProductDto } from 'src/modules/products/dto/create-product.dto';
import { UpdateProductDto } from 'src/modules/products/dto/update-product.dto';
import { Product } from 'src/modules/products/entity/products.entity';

export function ProductsDocs() {
  return applyDecorators(
    ApiTags('Products'),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function GetAllProductsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all products' }),
    ApiQuery({
      name: 'page',
      type: Number,
      required: false,
      description: 'Page number (1-indexed).',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      required: false,
      description: 'Number of items per page.',
      example: 20,
    }),
    ApiOkResponse({
      description: 'Returns a paginated list of products.',
      type: Product,
    }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
  );
}

export function GetProductsByTypeDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get products filtered by type' }),
    ApiQuery({
      name: 'type',
      enum: ProductType,
      description: 'Product category to filter by.',
    }),
    ApiQuery({
      name: 'page',
      type: Number,
      required: false,
      description: 'Page number (1-indexed).',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      required: false,
      description: 'Number of items per page.',
      example: 20,
    }),
    ApiOkResponse({
      description: 'Returns a paginated list of products of the given type.',
      type: Product,
    }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
  );
}

export function GetProductByNameDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a product by name' }),
    ApiQuery({
      name: 'name',
      type: String,
      description: 'Product name to look up.',
      example: 'Screen replacement',
    }),
    ApiOkResponse({
      description: 'Returns the matching product.',
      type: Product,
    }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
    ApiNotFoundResponse({ description: 'Product not found.' }),
  );
}

export function GetProductByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a product by ID' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The product ID',
      example: 1,
    }),
    ApiOkResponse({
      description: 'Returns the requested product.',
      type: Product,
    }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
    ApiNotFoundResponse({ description: 'Product not found.' }),
  );
}

export function CreateProductDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a product' }),
    ApiBody({ type: CreateProductDto }),
    ApiCreatedResponse({
      description: 'Returns the newly created product.',
      type: Product,
    }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
  );
}

export function UpdateProductDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a product' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The product ID',
      example: 1,
    }),
    ApiBody({ type: UpdateProductDto }),
    ApiOkResponse({
      description: 'Returns the updated product.',
      type: Product,
    }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
    ApiNotFoundResponse({ description: 'Product not found.' }),
  );
}

export function DeleteProductDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Soft delete a product' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The product ID',
      example: 1,
    }),
    ApiNoContentResponse({ description: 'Product deleted successfully.' }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
    ApiNotFoundResponse({ description: 'Product not found.' }),
  );
}
