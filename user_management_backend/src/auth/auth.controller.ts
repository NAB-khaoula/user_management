import {
  Controller,
  Delete,
  Get,
  Req,
  Request,
  Res,
  Response,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './Guards/jwt-auth.guard';

@Controller()
export class AuthController {
  @UseGuards(JwtAuthGuard)
  @Get('isAuthorized')
  isAuthorized(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/logout')
  logout(@Request() req, @Response() res) {
    res.clearCookie('access_token');
    res.end();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
