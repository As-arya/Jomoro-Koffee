import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  @MinLength(20)
  description!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  price!: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(999)
  stock!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  category_id!: number;
}

export class ReduceStockDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  quantity!: number;
}
