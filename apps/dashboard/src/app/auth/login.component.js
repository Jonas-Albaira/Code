import { __decorate, __metadata } from "tslib";
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
let LoginComponent = class LoginComponent {
    constructor(auth, router) {
        this.auth = auth;
        this.router = router;
        this.email = '';
        this.password = '';
        this.loading = signal(false);
        this.error = signal(null);
    }
    submit() {
        this.loading.set(true);
        this.error.set(null);
        this.auth.login(this.email, this.password).subscribe({
            next: (res) => {
                this.auth.setSession(res.access_token, res.user);
                this.router.navigateByUrl('/tasks');
            },
            error: (e) => {
                var _a;
                this.error.set(((_a = e === null || e === void 0 ? void 0 : e.error) === null || _a === void 0 ? void 0 : _a.message) || 'Login failed');
                this.loading.set(false);
            }
        });
    }
};
LoginComponent = __decorate([
    Component({
        standalone: true,
        selector: 'app-login',
        imports: [CommonModule, FormsModule],
        template: `
    <h2>Login</h2>
    <form (ngSubmit)="submit()" #f="ngForm" class="card">
      <label>Email <input name="email" [(ngModel)]="email" required type="email" /></label>
      <label>Password <input name="password" [(ngModel)]="password" required type="password" /></label>
      <button [disabled]="f.invalid || loading()">Login</button>
      <p *ngIf="error()" class="error">{{ error() }}</p>
    </form>
  `,
        styles: [`
    .card { display:flex; flex-direction:column; gap:12px; padding:16px; border:1px solid #e5e7eb; border-radius:8px; width:320px; }
    label { display:flex; justify-content:space-between; gap:8px; align-items:center; }
    input { flex:1; padding:6px 8px; }
    .error { color:crimson; }
  `]
    }),
    __metadata("design:paramtypes", [AuthService, Router])
], LoginComponent);
export { LoginComponent };
//# sourceMappingURL=login.component.js.map