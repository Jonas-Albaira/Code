import { __decorate, __metadata } from "tslib";
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
let AuditPageComponent = class AuditPageComponent {
    constructor(http, auth) {
        this.http = http;
        this.auth = auth;
        this.logs = signal('');
    }
    ngOnInit() {
        if (this.auth.isAdminOrOwner()) {
            this.http.get(`${environment.apiUrl}/audit-log`, { responseType: 'text' })
                .subscribe(txt => this.logs.set(txt));
        }
    }
};
AuditPageComponent = __decorate([
    Component({
        standalone: true,
        selector: 'app-audit-page',
        imports: [CommonModule],
        template: `
    <h2>Audit Log</h2>
    <p *ngIf="!auth.isAdminOrOwner()">You must be an Admin or Owner to view this page.</p>
    <pre *ngIf="auth.isAdminOrOwner()">{{ logs() }}</pre>
  `
    }),
    __metadata("design:paramtypes", [HttpClient, AuthService])
], AuditPageComponent);
export { AuditPageComponent };
//# sourceMappingURL=audit-page.component.js.map