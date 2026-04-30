// src/swagger/decorators/users.docs.ts
import { applyDecorators, ParseIntPipe } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function RepairsDocs() {
  return applyDecorators(
    ApiTags('Repairs'),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function getAllRepairs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Successfully executed' }),
    ApiForbiddenResponse({ description: 'Unauthorized' }),
    ApiOperation({
      description: 'Get all Repairs',
    }),
    ApiParam({ name: 'pagination' }),
  );
}

export function getRepairsByUserIdDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Successfully executed' }),
    ApiForbiddenResponse({ description: 'Unauthorized' }),
    ApiOperation({ description: 'Returns repairs for the user by UserID' }),
    ApiParam({ name: 'userId', type: ParseIntPipe }),
  );
}

export function getRepairsByIdDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Successfully executed' }),
    ApiForbiddenResponse({ description: 'Unauthorized' }),
    ApiOperation({ description: 'Returns repairs for the user by ID' }),
    ApiParam({ name: 'Id', type: ParseIntPipe }),
  );
}

export function creatRepairDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Successfully executed' }),
    ApiForbiddenResponse({ description: 'Unauthorized' }),
    ApiOperation({
      description:
        "Creates a repair, though it doesn't seem to have an identifier? Might need review",
    }),
  );
}
export function updateRepairByIdDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Successfully executed' }),
    ApiForbiddenResponse({ description: 'Unauthorized' }),
    ApiOperation({ description: 'Updates repair for the user by ID' }),
    ApiParam({ name: 'Id', type: ParseIntPipe }),
  );
}

export function updateRepairDetailsDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Successfully executed' }),
    ApiForbiddenResponse({ description: 'Unauthorized' }),
    ApiOperation({ description: 'Updates repair details' }),
    ApiParam({ name: 'Id', type: ParseIntPipe }),
  );
}

export function deleteRepairByIdDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Successfully executed' }),
    ApiForbiddenResponse({ description: 'Unauthorized' }),
    ApiOperation({ description: 'Deletes repair for the user by ID' }),
    ApiParam({ name: 'Id', type: ParseIntPipe }),
  );
}
