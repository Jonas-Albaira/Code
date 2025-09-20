
import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { User } from '@secure-task-manager/data';

/**
 * Very basic "auth" for the challenge:
 * - Reads X-User-Id from headers and attaches the matching User entity to req.user
 * - If absent, falls back to the first user in the database (useful for local dev).
 * DO NOT use in production.
 */
@Injectable()
export class HeaderAuthMiddleware implements NestMiddleware {
  private userRepo;
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.userRepo = this.dataSource.getRepository(User);
  }

  async use(req: Request & { user?: any }, res: Response, next: NextFunction) {
    try {
      const id = (req.headers['x-user-id'] || req.headers['X-User-Id'] || '') as string;
      if (id) {
        const user = await this.userRepo.findOne({ where: { id }, relations: ['organization'] });
        if (user) {
          req.user = user;
          return next();
        }
      }
      // Fallback to first user for local testing
      const first = await this.userRepo.find({ take: 1, relations: ['organization'] });
      if (first.length) req.user = first[0];
    } catch (e) {
      // ignore
    }
    next();
  }
}
