import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/common/enums/roles.enum';

export class UpdateUserRoleDto {
  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(Role, { message: 'Invalid role value' })
  role: Role;
}
