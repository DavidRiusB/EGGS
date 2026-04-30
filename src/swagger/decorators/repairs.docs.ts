// src/swagger/decorators/repairs.docs.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
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
import { CreateRepairDto } from 'src/modules/repairs/dto/create-repair.dto';
import { UpdateRepairDto } from 'src/modules/repairs/dto/update-repair.dto';
import { UpdateRepairDetailsDto } from 'src/modules/repairs/dto/update-repair-details.dto';
import { Repair } from 'src/modules/repairs/entity/repairs.entity';

export function RepairsDocs() {
  return applyDecorators(
    ApiTags('Repairs'),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function GetAllRepairsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all repairs' }),
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
      description: 'Returns a paginated list of repairs.',
      type: Repair,
    }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
  );
}

export function GetRepairsByUserIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get repairs by user ID' }),
    ApiParam({
      name: 'userId',
      type: Number,
      description: 'The user ID',
      example: 1,
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
      description: 'Returns a paginated list of repairs for the user.',
      type: Repair,
    }),
    ApiForbiddenResponse({
      description:
        'Forbidden when accessing another user without admin rights.',
    }),
    ApiNotFoundResponse({ description: 'User not found.' }),
  );
}

export function GetRepairByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a repair by ID' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The repair ID',
      example: 1,
    }),
    ApiOkResponse({
      description: 'Returns the requested repair.',
      type: Repair,
    }),
    ApiForbiddenResponse({
      description:
        'Forbidden when accessing another user repair without admin rights.',
    }),
    ApiNotFoundResponse({ description: 'Repair not found.' }),
  );
}

export function CreateRepairDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a repair' }),
    ApiBody({ type: CreateRepairDto }),
    ApiOkResponse({
      description: 'Returns the created repair.',
      type: Repair,
    }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
  );
}

export function UpdateRepairDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a repair' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The repair ID',
      example: 1,
    }),
    ApiBody({ type: UpdateRepairDto }),
    ApiOkResponse({
      description: 'Returns the updated repair.',
      type: Repair,
    }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
    ApiNotFoundResponse({ description: 'Repair not found.' }),
  );
}

export function UpdateRepairDetailsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update repair details (line items)' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The repair ID',
      example: 1,
    }),
    ApiBody({ type: UpdateRepairDetailsDto }),
    ApiOkResponse({
      description: 'Returns the repair with updated details.',
      type: Repair,
    }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
    ApiNotFoundResponse({ description: 'Repair not found.' }),
  );
}

export function DeleteRepairDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Soft delete a repair' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The repair ID',
      example: 1,
    }),
    ApiNoContentResponse({ description: 'Repair deleted successfully.' }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
    ApiNotFoundResponse({ description: 'Repair not found.' }),
  );
}
