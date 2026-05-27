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
  @ApiProperty({ example: 'Kopi Susu Jomoro' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Kopi Susu khas jomoro kaffee' })
  @IsString()
  @MinLength(20)
  description!: string;

  @ApiProperty({ example: 15000 })
  @IsInt()
  @Min(1)
  price!: number;

  @ApiProperty({ example: 67 })
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
