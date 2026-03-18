import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

import { Role } from 'src/common/enums/roles.enum';

export class RegisterUserDTO {
  id?: number;

  @IsNotEmpty({ message: 'Username is required' })
  @IsString()
  @MinLength(5, { message: 'Username must be at least 5 characters long' })
  @MaxLength(30, { message: 'Username must not exceed 30 characters' })
  userName: string;

  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(50, { message: 'Email must not exceed 50 characters' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(60, { message: 'Password must not exceed 40 characters' })
  password: string;

  @IsNotEmpty({ message: 'Confirm password is required' })
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  @MaxLength(10, { message: 'Telephone number must not exceed 10 digits' })
  telephone: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Invalid role value' })
  role?: Role;
}
