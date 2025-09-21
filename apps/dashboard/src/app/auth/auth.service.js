import { __decorate, __metadata } from "tslib";
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
let AuthService = class AuthService {
    constructor(http) {
        this.http = http;
        this._user = signal(null);
        this.user = computed(() => this._user());
        this.isAdminOrOwner = computed(() => {
            var _a;
            const r = (_a = this._user()) === null || _a === void 0 ? void 0 : _a.role;
            return r === 'Admin' || r === 'Owner';
        });
        const u = localStorage.getItem('user');
        if (u)
            this._user.set(JSON.parse(u));
    }
    login(email, password) {
        return this.http.post(`${environment.apiUrl}/auth/login`, { email, password });
    }
    setSession(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this._user.set(user);
    }
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this._user.set(null);
    }
};
AuthService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [HttpClient])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map