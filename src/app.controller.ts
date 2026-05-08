import { Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { type Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { IsPublic } from './is-public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Inject(JwtService)
  private jwtService: JwtService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: Request) {
    console.log(req.user);
    const token = await this.jwtService.signAsync(
      {
        userId: req.user?.userId,
        username: req.user?.username,
      },
      { expiresIn: '0.5h' },
    );
    return { access_token: token };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }

  @Get('public')
  @IsPublic()
  getPublic() {
    return { message: 'This is a public endpoint' };
  }

  @Get('private')
  getPrivate(@Req() req: Request) {
    return { message: 'This is a private endpoint', user: req.user };
  }
}
