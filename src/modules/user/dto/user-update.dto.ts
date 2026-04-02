import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UserUpdateDto {
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @Length(2, 50, {
    message: 'First name must be between 2 and 50 characters',
  })
  @Matches(/^(?!\s*$).+/, {
    message: 'First name cannot be empty or just spaces',
  })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @Length(2, 50, {
    message: 'Last name must be between 2 and 50 characters',
  })
  @Matches(/^(?!\s*$).+/, {
    message: 'Last name cannot be empty or just spaces',
  })
  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  @Length(5, 100, {
    message: 'Email must be between 5 and 100 characters',
  })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Telephone must be a string' })
  @Matches(/^\+?[1-9]\d{7,14}$/, {
    message:
      'Telephone must be a valid international number (8–15 digits, optional +)',
  })
  telephone?: string;
}
