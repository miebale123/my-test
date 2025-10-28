import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const server = express();
let cachedApp: any = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    await app.init();
    cachedApp = server;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  cachedApp(req, res);
}
