// src/swagger/decorators/address.docs.ts
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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AddressDto } from 'src/modules/address/dto/address.dto';
import { UpdateAddressDto } from 'src/modules/address/dto/update-address.dto';
import { Address } from 'src/modules/address/entity/address.entity';

export function AddressesDocs() {
  return applyDecorators(
    ApiTags('Addresses'),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function GetUserAddressesDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all addresses for a user' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The user ID',
      example: 1,
    }),
    ApiOkResponse({
      description: 'Returns the list of addresses for the user.',
      type: Address,
    }),
    ApiForbiddenResponse({
      description:
        'Forbidden when accessing another user without admin rights.',
    }),
    ApiNotFoundResponse({ description: 'User not found.' }),
  );
}

export function RegisterAddressDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new address for a user' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The user ID',
      example: 1,
    }),
    ApiBody({ type: AddressDto }),
    ApiCreatedResponse({
      description: 'Returns the newly created address.',
      type: Address,
    }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiForbiddenResponse({
      description:
        'Forbidden when creating an address for another user without admin rights.',
    }),
    ApiNotFoundResponse({ description: 'User not found.' }),
  );
}

export function UpdateAddressDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update an address' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The address ID',
      example: 1,
    }),
    ApiBody({ type: UpdateAddressDto }),
    ApiOkResponse({
      description: 'Returns the updated address.',
      type: Address,
    }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiForbiddenResponse({
      description:
        'Forbidden when updating an address you do not own without admin rights.',
    }),
    ApiNotFoundResponse({ description: 'Address not found.' }),
  );
}

export function DeleteAddressDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Soft delete an address' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'The address ID',
      example: 1,
    }),
    ApiNoContentResponse({ description: 'Address deleted successfully.' }),
    ApiForbiddenResponse({
      description:
        'Forbidden when deleting an address you do not own without admin rights.',
    }),
    ApiNotFoundResponse({ description: 'Address not found.' }),
  );
}
