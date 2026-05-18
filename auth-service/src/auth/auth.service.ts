import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    this.validateEmailExtension(dto.email);
    this.validatePassword(dto.password);

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    await this.prisma.user.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        email: dto.email,
        password: dto.password,
        role: 'CUSTOMER',
      },
    });

    return { message: 'Registration successful' };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Email not found');
    }
    if (user.password !== dto.password) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload: JwtPayload = { id: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  private validateEmailExtension(email: string) {
    const normalizedEmail = email.toLowerCase();
    const allowedExtensions = ['.com', '.net', '.org', '.id'];
    const hasAllowedExtension = allowedExtensions.some((extension) =>
      normalizedEmail.endsWith(extension),
    );

    if (!hasAllowedExtension) {
      throw new BadRequestException(
        'Email must end with .com, .net, .org, or .id',
      );
    }
  }

  private validatePassword(password: string) {
    if (password.includes(' ')) {
      throw new BadRequestException('Password cannot contain spaces');
    }
    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }
    if (this.countDigits(password) < 2) {
      throw new BadRequestException(
        'Password must contain at least 2 numeric digits',
      );
    }
  }

  private countDigits(value: string) {
    let digitCount = 0;
    for (const character of value) {
      if (character >= '0' && character <= '9') {
        digitCount += 1;
      }
    }

    return digitCount;
  }
}
