import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Budi' })
  @IsAlpha()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Alotia' })
  @IsAlpha()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: 'budi@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
