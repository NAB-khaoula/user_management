import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { TwoFactorAuthService } from './2fa.service';
import * as QRCode from 'qrcode';
import { Response } from 'express';
import { twoFA } from './interface/2fa.interface';

@Controller('twofactorAuth')
export class TwoFactorAuthController {
  constructor(
    private twoFactorAuthService: TwoFactorAuthService,
    private userService: UsersService,
  ) {}

  @Get()
  test() {
    return 'this action returns test';
  }

  @UseGuards(JwtAuthGuard)
  @Get('/register')
  async register(@Req() req, @Res() res: Response) {
    const user = req.user;
    const { otpauthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthenticationSecret(
        user,
      );
    await QRCode.toDataURL(otpauthUrl).then((result) =>
      res.send(JSON.stringify({ qrcode: result })),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/turnOn')
  async trunOn2FA(@Body() twoFACode: twoFA, @Req() req) {
    const user = await this.userService.getUserBylogin(req.user['login']);
    const isValidCode = this.twoFactorAuthService.is2FactorAuthCodeValid(
      twoFACode.code,
      user,
    );
    if (!isValidCode)
      throw new UnauthorizedException('Invalid authentication code');
    await this.userService.turnOnTwoFactorAuthentication(user['login']);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Get('turnoff')
  turnOff2FA(@Req() req) {
    const user = req.user;
    if (!user.isTwoFactorAuthenticated)
      throw new BadRequestException('2-Factor-Authentication is not enabled!');
    this.userService.unSet2FASecret(user.login);
  }

  @UseGuards(JwtAuthGuard)
  @Post('turnAuthOn')
  async turnAuthOn(@Req() req) {
    this.userService.EnableDisable2FA(req.user['login']);
    return await this.userService.getUserBylogin(req.user['login']);
  }
}
