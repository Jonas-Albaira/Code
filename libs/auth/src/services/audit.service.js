import { __decorate } from "tslib";
/**
 * Minimal audit logging service with in-memory ring buffer.
 */
import { Injectable } from '@nestjs/common';
let AuditService = class AuditService {
    constructor() {
        this.buffer = [];
        this.max = 500;
    }
    log(userId, action, resource, resourceId, meta) {
        const entry = {
            ts: new Date().toISOString(),
            userId,
            action,
            resource,
            resourceId,
            meta,
        };
        this.buffer.push(entry);
        if (this.buffer.length > this.max)
            this.buffer.shift();
        // also print to console
        console.log(`[AUDIT] ${entry.ts} | user=${userId} action=${action} resource=${resource} id=${resourceId !== null && resourceId !== void 0 ? resourceId : ''}`);
    }
    all() {
        return [...this.buffer].reverse(); // newest first
    }
};
AuditService = __decorate([
    Injectable()
], AuditService);
export { AuditService };
//# sourceMappingURL=audit.service.js.map