
import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './task.service';
import { PermissionsGuard, Permissions } from '@secure-task-manager/auth';
import { CreateTaskDto, UpdateTaskDto } from '@secure-task-manager/data';

@Controller('tasks')
@UseGuards(PermissionsGuard)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  // Create task (permission check via guard)
  @Post()
  @Permissions('task:create')
  async create(@Req() req: any, @Body() dto: CreateTaskDto) {
    return this.tasks.create(req.user, dto);
  }

  // List tasks visible to the current user (role/org scoped)
  @Get()
  async list(@Req() req: any) {
    return this.tasks.listVisibleTasks(req.user);
  }

  // Edit task
  @Put(':id')
  @Permissions('task:edit')
  async update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateTaskDto) {
    return this.tasks.update(req.user, id, dto);
  }

  // Delete task
  @Delete(':id')
  @Permissions('task:delete')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.tasks.remove(req.user, id);
  }
}
