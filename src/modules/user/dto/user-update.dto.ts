import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserUpdateDto {
  @ApiPropertyOptional({
    description: 'First name (2-50 characters).',
    example: 'John',
    minLength: 2,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @Length(2, 50, {
    message: 'First name must be between 2 and 50 characters',
  })
  @Matches(/^(?!\s*$).+/, {
    message: 'First name cannot be empty or just spaces',
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name (2-50 characters).',
    example: 'Doe',
    minLength: 2,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @Length(2, 50, {
    message: 'Last name must be between 2 and 50 characters',
  })
  @Matches(/^(?!\s*$).+/, {
    message: 'Last name cannot be empty or just spaces',
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User email address.',
    example: 'john.doe@example.com',
    minLength: 5,
    maxLength: 100,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  @Length(5, 100, {
    message: 'Email must be between 5 and 100 characters',
  })
  email?: string;

  @ApiPropertyOptional({
    description:
      'International telephone number (8-15 digits, optional leading +).',
    example: '+18015551234',
  })
  @IsOptional()
  @IsString({ message: 'Telephone must be a string' })
  @Matches(/^\+?[1-9]\d{7,14}$/, {
    message:
      'Telephone must be a valid international number (8–15 digits, optional +)',
  })
  telephone?: string;
}
