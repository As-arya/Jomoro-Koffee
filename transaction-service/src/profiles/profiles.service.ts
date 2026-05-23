import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ProfilesService {
  private authServiceUrl = process.env.AUTH_SERVICE_URL;

  async getProfile(token: string) {
    const res = await fetch(`${this.authServiceUrl}/profiles`, {
      headers: { Authorization: token },
    });
    if (!res.ok) throw new BadRequestException('Failed to fetch profile');
    return res.json();
  }
}