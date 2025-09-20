/**
 * Minimal audit logging service with in-memory ring buffer.
 */
import { Injectable } from '@nestjs/common';

export interface AuditEntry {
  ts: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  meta?: any;
}

@Injectable()
export class AuditService {
  private buffer: AuditEntry[] = [];
  private readonly max = 500;

  log(userId: string, action: string, resource: string, resourceId?: string, meta?: any) {
    const entry: AuditEntry = {
      ts: new Date().toISOString(),
      userId,
      action,
      resource,
      resourceId,
      meta,
    };
    this.buffer.push(entry);
    if (this.buffer.length > this.max) this.buffer.shift();
    // also print to console
    console.log(`[AUDIT] ${entry.ts} | user=${userId} action=${action} resource=${resource} id=${resourceId ?? ''}`);
  }

  all(): AuditEntry[] {
    return [...this.buffer].reverse(); // newest first
  }
}
