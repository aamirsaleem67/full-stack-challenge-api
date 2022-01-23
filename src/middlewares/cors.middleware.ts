import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(_: Request, res: Response, next: () => void) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set(
      'Access-Control-Allow-Headers',
      'Origin, x-access-token, Content-Type, Authorization',
    );
    res.set('Access-Control-Allow-Credentials', 'true');
    next();
  }
}
