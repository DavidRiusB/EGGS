// src/swagger/decorators/auth.docs.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserDto } from 'src/modules/auth/dto/login.dto';
import { RegisterUserDto } from 'src/modules/auth/dto/register.dto';
import { User } from 'src/modules/user/entity/user.entity';

export function AuthDocs() {
  return applyDecorators(ApiTags('Auth'));
}

export function RegisterDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Register a new user',
      description:
        'Creates a new user account, signs them in, and sets the access_token cookie.',
    }),
    ApiBody({ type: RegisterUserDto }),
    ApiCreatedResponse({
      description:
        'Returns the newly created user. Sets the access_token httpOnly cookie.',
      type: User,
    }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiConflictResponse({
      description: 'A user with this email or username already exists.',
    }),
  );
}

export function LoginDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Log in',
      description:
        'Validates credentials and sets the access_token httpOnly cookie.',
    }),
    ApiBody({ type: LoginUserDto }),
    ApiOkResponse({
      description: 'Returns the authenticated user. Sets the access_token cookie.',
      type: User,
    }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiUnauthorizedResponse({ description: 'Invalid email or password.' }),
  );
}

export function MeDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get the currently authenticated user' }),
    ApiOkResponse({
      description: 'Returns the user attached to the request.',
      type: User,
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function LogoutDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Log out',
      description: 'Clears the access_token cookie.',
    }),
    ApiOkResponse({
      description: 'Returns { success: true }. Clears the access_token cookie.',
    }),
  );
}
