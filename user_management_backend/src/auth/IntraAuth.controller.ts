import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { IntraAuthGuard } from './Guards/auth.guard';
import { IntraAuthService } from './services/IntraAuth.service';

@Controller('oauth')
export class IntraAuthController {
  constructor(private readonly intraAuthService: IntraAuthService) {}

  /**
   * /api/ /home/login
   * this is the route for authentication
   */
  userData;
  accessToken;

  @Get('login')
  @UseGuards(IntraAuthGuard)
  async login() {
    return;
  }

  @Get()
  async redirect(@Query() query, @Res() res) {
    this.accessToken = await this.intraAuthService
      .getAccessToken(query)
      .then((resolve) => resolve.data)
      .catch((error) => console.log(error));
    this.userData = await this.intraAuthService
      .getUserData(this.accessToken['access_token'])
      .then((resolve) => resolve.data)
      .catch((error) => {
        console.log(error);
      });
    return res.status(HttpStatus.OK).json({
      access_token: await this.intraAuthService.signToken(
        this.userData.id,
        this.userData.email,
      ),
    });
  }

  /**
   * /api/ /home/status
   * retrieve the status auth
   */
}