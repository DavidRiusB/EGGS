// src/swagger/decorators/users.docs.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

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
    ApiOkResponse({ description: 'Returns a paginated list of users.' }),
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
    ApiOkResponse({ description: 'Returns the matching user.' }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
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
    ApiOkResponse({ description: 'Returns the matching user.' }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
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
    ApiOkResponse({ description: 'Returns the requested user.' }),
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
    ApiOkResponse({ description: 'Returns the updated user.' }),
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
    ApiOkResponse({ description: 'Returns the user with the updated role.' }),
    ApiForbiddenResponse({ description: 'Admin only.' }),
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
    ApiOkResponse({ description: 'User deleted successfully.' }),
  );
}
