import { IsEmail, IsNotEmpty } from 'class-validator';

export class ChangeEmailDto {
  @IsEmail({}, { message: 'Must be a valid email' })
  @IsNotEmpty()
  email: string;
}
