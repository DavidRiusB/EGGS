import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/roles.enum';

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'New role to assign to the user.',
    enum: Role,
  })
  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(Role, { message: 'Invalid role value' })
  role: Role;
}
