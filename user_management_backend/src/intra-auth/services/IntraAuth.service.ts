import { Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IntraAuthService {
  constructor(
    private readonly httpService: HttpService,
    private jwt: JwtService,
  ) {}
  async getAccessToken(query: any): Promise<any> {
    return firstValueFrom(
      this.httpService.post('https://api.intra.42.fr/oauth/token', {
        grant_type: 'authorization_code',
        client_id: process.env.INTRA_CLIENT_ID,
        client_secret: process.env.INTRA_SECRET,
        code: query.code,
        redirect_uri: process.env.INTRA_CALLBACK_URL,
      }),
    );
  }
  async getUserData(authCode: string): Promise<any> {
    return firstValueFrom(
      this.httpService.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `bearer ${authCode}`,
        },
      }),
    );
  }

  // async signToken(userId: number, email: string): Promise<string> {
  //   const payload = {
  //     sub: userId,
  //     email,
  //   };
  //   return this.jwt.signAsync(payload, {
  //     expiresIn: '15m',
  //     secret: process.env.JWT_SECRET,
  //   });
  // }
}