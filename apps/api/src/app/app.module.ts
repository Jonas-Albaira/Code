import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuditController } from './audit.controller';
import { TasksController } from './tasks.controller';
import { AppService } from './app.service';
import { AccessService, AuditService } from '@secure-task-manager/auth';
import { TaskOwnershipGuard } from './task-ownership.guard';
import { Task, Organization, User } from '@secure-task-manager/data';
import { TasksService } from './task.service';
import { HeaderAuthMiddleware } from './auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', // or 'postgres'
      database: 'db.sqlite',
      autoLoadEntities: true,
      synchronize: true, // dev only
    }),
    TypeOrmModule.forFeature([Task, Organization, User]),
  ],
  controllers: [AppController, TasksController, AuditController],
  providers: [AppService, AccessService, AuditService, TaskOwnershipGuard, TasksService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HeaderAuthMiddleware).forRoutes('*');
  }
}
