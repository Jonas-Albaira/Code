import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
// @ts-ignore
let TaskService = class TaskService {
    constructor(http) {
        this.http = http;
    }
    list() {
        return this.http.get(`${environment.apiUrl}/tasks`);
    }
    create(dto) {
        return this.http.post(`${environment.apiUrl}/tasks`, dto);
    }
    update(id, dto) {
        return this.http.put(`${environment.apiUrl}/tasks/${id}`, dto);
    }
    remove(id) {
        return this.http.delete(`${environment.apiUrl}/tasks/${id}`);
    }
};
TaskService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [HttpClient])
], TaskService);
export { TaskService };
//# sourceMappingURL=task.service.js.map