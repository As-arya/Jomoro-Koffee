import { IsInt, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCartDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  product_id!: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity!: number;
}