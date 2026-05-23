import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  quantity!: number;
}