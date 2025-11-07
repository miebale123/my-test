// backend/strategy.ts
import { Injectable, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import 'dotenv/config';
import express from 'express';

import { Controller, Get, Module } from '@nestjs/common';

export interface AuthUser {
  email?: string;
  provider: string;
  providerId: string;
  accessToken?: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackURL = process.env.GOOGLE_CALLBACK_URL;

    if (!clientID || !clientSecret) {
      throw new Error('Google client ID and secret not found');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: any): AuthUser {
    const email =
      profile?.emails && profile.emails.length > 0
        ? profile.emails[0].value
        : null;

    return {
      email: email ?? undefined,
      provider: 'google',
      providerId: profile?.id ?? 'unknown',
      accessToken,
    };
  }
}
// // backend/controller.ts
// import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import express from 'express';

// @Controller()
// export class AppController {

//   @Get('google')
//   @UseGuards(AuthGuard('google'))
//   async googleLogin() {}

//   @Get('google/callback')
//   @UseGuards(AuthGuard('google'))
//   async googleCallback(
//     @Req() req: express.Request & { user?: AuthUser },
//     @Res() res: express.Response,
//   ) {
//     console.log('✅ Callback hit!');
//     console.log('User from passport:', req.user);
//     const user = req.user;
//     if (!user?.email) {
//       return res.status(400).send('Authentication failed');
//     }

//     const { email, accessToken } = user;
//     console.log('user:', user);

//     return res.redirect(
//       `http://localhost:4200/?token=${accessToken}&email=${encodeURIComponent(email)}`,
//     );
//   }
// }

@Controller()
class AppController {
  @Get('/')
  getRoot() {
    return { message: 'Welcome to the Auth Service' };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: express.Request & { user?: AuthUser },
    @Res() res: express.Response,
  ) {
    console.log('✅ Callback hit!');
    console.log('User from passport:', req.user);
    const user = req.user;
    if (!user?.email) {
      return res.status(400).send('Authentication failed');
    }

    const { email, accessToken } = user;
    console.log('user:', user);

    return res.redirect(
      `https://google-auth-gilt.vercel.app/?token=${accessToken}&email=${encodeURIComponent(email)}`,
    );
  }
}

@Module({ controllers: [AppController], providers: [GoogleStrategy] })
export class AppModule {}
