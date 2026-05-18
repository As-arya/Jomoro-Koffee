import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Arya' })
  @IsAlpha()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Alotia' })
  @IsAlpha()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: 'example@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
