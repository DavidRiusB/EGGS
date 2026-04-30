// src/swagger/decorators/users.docs.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
import { User } from 'src/modules/user/entity/user.entity';

export function UsersDocs() {
  return applyDecorators(
    ApiTags('Users'),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function GetAllUsersDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all users' }),
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
      description: 'Returns a paginated list of users.',
      type: User,
    }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
  );
}

export function GetUserByEmailDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a user by email' }),
    ApiParam({
      name: 'email',
      type: String,
      description: 'The user email address',
      example: 'user@example.com',
    }),
    ApiOkResponse({ description: 'Returns the matching user.', type: User }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
    ApiNotFoundResponse({ description: 'User not found.' }),
  );
}

export function GetUserByTelephoneDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a user by telephone' }),
    ApiParam({
      name: 'telephone',
      type: String,
      description: 'The user telephone number',
      example: '8015551234',
    }),
    ApiOkResponse({ description: 'Returns the matching user.', type: User }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
    ApiNotFoundResponse({ description: 'User not found.' }),
  );
}

export function GetUserByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a user by ID' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The user ID',
      example: 1,
    }),
    ApiOkResponse({ description: 'Returns the requested user.', type: User }),
    ApiForbiddenResponse({
      description:
        'Forbidden when accessing another user without admin rights.',
    }),
    ApiNotFoundResponse({ description: 'User not found.' }),
  );
}

export function UpdateUserDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a user' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The user ID',
      example: 1,
    }),
    ApiOkResponse({ description: 'Returns the updated user.', type: User }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiForbiddenResponse({
      description: 'Forbidden when updating another user without admin rights.',
    }),
    ApiNotFoundResponse({ description: 'User not found.' }),
  );
}

export function UpdateUserRoleDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a user role' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The user ID',
      example: 1,
    }),
    ApiOkResponse({
      description: 'Returns the user with the updated role.',
      type: User,
    }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
    ApiNotFoundResponse({ description: 'User not found.' }),
  );
}

export function DeleteUserDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Soft delete a user' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The user ID',
      example: 1,
    }),
    ApiNoContentResponse({ description: 'User deleted successfully.' }),
    ApiForbiddenResponse({
      description: 'Forbidden when deleting another user without admin rights.',
    }),
    ApiNotFoundResponse({ description: 'User not found.' }),
  );
}
