import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/enums/roles.enum';

export class UserUpdateDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Role)
  role?: Role;
}
