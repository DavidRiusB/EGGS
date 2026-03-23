import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { CreateRepairDetailRefDto } from 'src/modules/repair-details/dto/detail-ref.dto';

export class CreateRepairDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber({}, { message: 'User ID must be a number' })
  userId: number;

  @IsArray({ message: 'Details must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreateRepairDetailRefDto)
  details: CreateRepairDetailRefDto[];
}
