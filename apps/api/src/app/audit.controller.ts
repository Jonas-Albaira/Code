
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuditService } from '@secure-task-manager/auth';
import { RolesGuard } from '@secure-task-manager/auth';
import { Roles } from '@secure-task-manager/auth';
import { Role } from '@secure-task-manager/auth';

@Controller('audit-log')
@UseGuards(RolesGuard)
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  @Roles(Role.Owner, Role.Admin)
  async getAll(@Req() req: any) {
    // Optionally, could scope to user's org here if needed
    return this.audit.all();
  }
}
